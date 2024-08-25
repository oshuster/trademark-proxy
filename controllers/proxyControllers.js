import axios from "axios";
import { errorLogger, logResponse } from "../config/logConfig.js";
import { trademarkSearchHtmlCleaner } from "../helpers/trademarkSearchHtmlCleaner.js";
import { trademarkDetailsHtmlCleaner } from "../helpers/TrademarkDetailsCleaner.js";

export const getAllTrademark = async (req, res) => {
  try {
    const { q, p } = req.query;
    const response = await axios.get(
      "https://iprop-ua.com/api/parts/tm-search-results/",
      {
        params: { q, p },
      }
    );

    const parsedHtml = trademarkSearchHtmlCleaner(response.data);
    const oneLineResponse = parsedHtml.html?.replace(/\s+/g, " ").trim();

    logResponse({ statusCode: response.status, data: oneLineResponse });
    // Відправка обробленого HTML
    res.status(response.status).send(parsedHtml);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    errorLogger.error(`Error fetching data: ${error.message}`);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Error fetching data" });
  }
};

export const getTrademarkDetails = async (req, res) => {
  try {
    const { q } = req.query;
    const queryString = decodeURIComponent(q);

    const response = await axios.get(`https://iprop-ua.com${queryString}`);

    const parsedHtml = trademarkDetailsHtmlCleaner(response.data);

    // Відправка обробленого HTML
    res.status(response.status).send(parsedHtml);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    errorLogger.error(`Error fetching data: ${error.message}`);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Error fetching data" });
  }
};
