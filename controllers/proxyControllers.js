import axios from "axios";
import { errorLogger, logRequest, logResponse } from "../config/logConfig.js";
import { parserHtml } from "../helpers/parserHtml.js";

export const getTrademark = async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      "https://iprop-ua.com/api/parts/tm-search-results/",
      {
        params: { q },
      }
    );

    const parsedResponse = parserHtml(response.data);
    const oneLineResponse = parsedResponse.replace(/\s+/g, " ").trim();

    logResponse({ statusCode: response.status, data: oneLineResponse });
    // Відправка обробленого HTML
    res.status(response.status).send(parsedResponse);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    errorLogger.error(`Error fetching data: ${error.message}`);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Error fetching data" });
  }
};
