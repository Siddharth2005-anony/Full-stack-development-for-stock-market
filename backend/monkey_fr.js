const axios = require("axios");

const clientId = "2UUYDGL6IZ-100";
const accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZDoxIiwiZDoyIiwieDowIiwieDoxIiwieDoyIl0sImF0X2hhc2giOiJnQUFBQUFCcHhvZXQ0ZEVYWmdTZjNCZ1hnWXV6TFludFpGZnRySk5xbFo0ME9VMnFZVEFJY25TRUxlcEJkOEJ5NzR4VFJCWTVQVnh6d2F1aFZZMUNhQ3JfYlVOTUp2RVhVMndtcWZPb2FuSm96bXk5YUpWRG5Vbz0iLCJkaXNwbGF5X25hbWUiOiIiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIxOTM1ZGNkOWQxYzRiMTk0ZmRjODJhNDg0OGRkYTIwNzQ3NWIzOWFlYWNmMmI1Mjk5NGY4NjFmZSIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImZ5X2lkIjoiRkFJNjcyMzgiLCJhcHBUeXBlIjoxMDAsImV4cCI6MTc3NDY1NzgwMCwiaWF0IjoxNzc0NjE4NTQxLCJpc3MiOiJhcGkuZnllcnMuaW4iLCJuYmYiOjE3NzQ2MTg1NDEsInN1YiI6ImFjY2Vzc190b2tlbiJ9.1qZjvPPdSluUr2QFhrM6moHnKMV2JQE1EjaQsp-e-qk"


const data = {
  symbol: "NSE:TCS-EQ",
  resolution: "D",
  date_format: "1",
  range_from: "2026-01-05",
  range_to: "2026-02-05",
  cont_flag: "1",
};

async function fetchHistory() {
  const response = await axios.get("https://api-t1.fyers.in/data/history", {
    params: data,
    headers: {
      Authorization: `${clientId}:${accessToken}`,
    },
  });

  const result = response.data;
  console.log(JSON.stringify(result, null, 4));

  const formattedData = result.candles.map((candle) => {
    const dateStr = new Date(candle[0] * 1000).toISOString().split("T")[0];
    return {
      symbol: data.symbol,
      date: dateStr,
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    };
  });

  console.log(JSON.stringify(formattedData, null, 4));
}

fetchHistory();