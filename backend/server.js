const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // allows React (localhost:3000) to fetch from localhost:5000
app.use(express.json());

// MongoDB config
const url = "mongodb://127.0.0.1:27017";
const dbName = "test";
const collectionName = "fyers_history";
const defaultSymbol = "HDFCBANK";

function extractBaseSymbol(dbSymbol) {
  if (!dbSymbol || typeof dbSymbol !== "string") return null;

  const normalized = dbSymbol.trim().toUpperCase();
  if (!normalized) return null;

  // Handles values like NSE:INFY-EQ, NSE:HDFCBANK-EQ, INFY-EQ, INFY
  const exchangeMatch = normalized.match(/^[A-Z]+:([A-Z0-9_-]+)$/);
  const symbolWithSuffix = exchangeMatch ? exchangeMatch[1] : normalized;
  const base = symbolWithSuffix.split("-")[0];

  return base || null;
}

function buildSymbolAliases(dbSymbols = []) {
  const aliases = new Map();

  for (const symbol of dbSymbols) {
    if (!symbol || typeof symbol !== "string") continue;

    const normalizedDbSymbol = symbol.trim();
    if (!normalizedDbSymbol) continue;

    aliases.set(normalizedDbSymbol.toUpperCase(), normalizedDbSymbol);

    const baseSymbol = extractBaseSymbol(normalizedDbSymbol);
    if (baseSymbol) {
      aliases.set(baseSymbol, normalizedDbSymbol);
    }
  }

  return aliases;
}

function resolveSymbol(rawSymbol, aliases, fallbackDbSymbol) {
  if (!rawSymbol || typeof rawSymbol !== "string") return fallbackDbSymbol;

  const trimmed = rawSymbol.trim().toUpperCase();
  if (!trimmed) return fallbackDbSymbol;

  return aliases.get(trimmed) || null;
}

function listSupportedSymbols(dbSymbols = []) {
  return Array.from(
    new Set(
      dbSymbols
        .map((symbol) => extractBaseSymbol(symbol))
        .filter(Boolean)
    )
  ).sort();
}

// GET /data - returns symbol-specific close prices from fyers_history
app.get("/data", async (req, res) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const dbSymbols = await collection.distinct("symbol");
    const symbolAliases = buildSymbolAliases(dbSymbols);
    const supportedSymbols = listSupportedSymbols(dbSymbols);
    const defaultDbSymbol = symbolAliases.get(defaultSymbol) || dbSymbols[0] || null;
    const dbSymbol = resolveSymbol(req.query.symbol, symbolAliases, defaultDbSymbol);

    if (!dbSymbol) {
      const supportedLabel = supportedSymbols.length ? supportedSymbols.join(", ") : "None found";

      return res.status(400).json({
        success: false,
        message: `Invalid symbol. Supported symbols: ${supportedLabel}.`,
      });
    }

    const data = await collection.find({ symbol: dbSymbol }).sort({ date: 1 }).toArray();
    const closePrices = data.map((doc) => doc.close);
    const dates = data.map((doc) => doc.date);

    res.status(200).json({
      success: true,
      count: closePrices.length,
      symbol: dbSymbol,
      supportedSymbols,
      dates,
      closePrices,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// GET /symbols - returns all base symbols available in fyers_history
app.get("/symbols", async (_req, res) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const dbSymbols = await collection.distinct("symbol");
    const symbols = listSupportedSymbols(dbSymbols);

    return res.status(200).json({
      success: true,
      count: symbols.length,
      symbols,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
