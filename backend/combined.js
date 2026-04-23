const axios = require("axios");
const { MongoClient } = require("mongodb");

const config = {
  fyers: {
    clientId: process.env.FYERS_CLIENT_ID || "2UUYDGL6IZ-100",
    accessToken:
      process.env.FYERS_ACCESS_TOKEN ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZDoxIiwiZDoyIiwieDowIiwieDoxIiwieDoyIl0sImF0X2hhc2giOiJnQUFBQUFCcDBNbXY5UnkxYUtUMXBoMFhrUGlqbFlDVE5pYmFHeFAwa1d3N0xVWktnN2FCd2FoVXdaQlRjUzMzdVp1SHhsa1owWTdwZFlGa05KcEFZUW5FNVVnU1VVT2dRZTN0emczNVI1OWFkQlQzcEFYWkdzTT0iLCJkaXNwbGF5X25hbWUiOiIiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiI1ODRjMGUwODA4MTM0ZmU0MGU4Mjg4NmY5NGJiZTRiN2MzOWRkZWQ5ODBmM2I3YWM0NmRkNjJmOSIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImZ5X2lkIjoiRkFJNjcyMzgiLCJhcHBUeXBlIjoxMDAsImV4cCI6MTc3NTM0OTAwMCwiaWF0IjoxNzc1MjkwNzk5LCJpc3MiOiJhcGkuZnllcnMuaW4iLCJuYmYiOjE3NzUyOTA3OTksInN1YiI6ImFjY2Vzc190b2tlbiJ9.ULSiH-KdKRIIp6r7QzJ_Jt0gNGrPbb8emec2pgohb50",
    symbols: ["NSE:IDFCFIRSTB-EQ","NSE:BPCL-EQ","NSE:INFY-EQ","NSE:RELIANCE-EQ","NSE:TCS-EQ","NSE:ITC-EQ","NSE:HDFCBANK-EQ","NSE:MRF-EQ"],
    historyBaseParams: {
      resolution: "D",
      date_format: "1",
      range_from: "2025-04-01",
      range_to: "2026-03-01",
      cont_flag: "1",
    },
    endpoint: "https://api-t1.fyers.in/data/history",
  },
  mongo: {
    url: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
    dbName: process.env.MONGO_DB_NAME || "test",
    collectionName: process.env.MONGO_COLLECTION || "fyers_history",
  },
};

function formatCandles(candles, symbol) {
  return candles.map((candle) => ({
    symbol,
    date: new Date(candle[0] * 1000).toISOString().split("T")[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
    volume: candle[5],
  }));
}

async function fetchHistoryForSymbol(symbol) {
  const response = await axios.get(config.fyers.endpoint, {
    params: {
      symbol,
      ...config.fyers.historyBaseParams,
    },
    headers: {
      Authorization: `${config.fyers.clientId}:${config.fyers.accessToken}`,
    },
  });

  const result = response.data;
  if (!result || !Array.isArray(result.candles)) {
    throw new Error(`Fyers response for ${symbol} does not contain a valid candles array.`);
  }

  return formatCandles(result.candles, symbol);
}

async function saveToMongo(candles) {
  const client = new MongoClient(config.mongo.url);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const collection = client
      .db(config.mongo.dbName)
      .collection(config.mongo.collectionName);

    const operations = candles.map((row) => ({
      updateOne: {
        filter: { symbol: row.symbol, date: row.date },
        update: { $set: row },
        upsert: true,
      },
    }));

    const writeResult = await collection.bulkWrite(operations);
    console.log(
      `MongoDB write complete. Upserted: ${writeResult.upsertedCount}, Modified: ${writeResult.modifiedCount}`
    );

    return collection;
  } finally {
    await client.close();
  }
}

async function main() {
  try {
    const allCandles = [];

    for (const symbol of config.fyers.symbols) {
      const candles = await fetchHistoryForSymbol(symbol);
      console.log(`Fetched ${candles.length} candles from Fyers for ${symbol}`);
      allCandles.push(...candles);
    }

    await saveToMongo(allCandles);
    console.log(`Stored/updated ${allCandles.length} candles across ${config.fyers.symbols.length} symbols.`);
  } catch (error) {
    const details =
      (error && error.response && error.response.data) ||
      (error && error.stack) ||
      error;
    console.error("Combined flow failed:", details);
  }
}

main();
