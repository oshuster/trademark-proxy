import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTrademark = async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      "https://iprop-ua.com/api/parts/tm-search-results/",
      {
        params: { q },
      }
    );

    // Логування відповіді у файл
    const logFilePath = path.join(__dirname, `response.log`);
    const logData = `Time: ${new Date().toISOString()}\nQuery: ${q}\nResponse: ${JSON.stringify(
      response.data,
      null,
      2
    )}\n\n`;

    fs.appendFile(logFilePath, logData, (err) => {
      if (err) {
        console.error("Error logging response:", err.message);
      } else {
        console.log("Response logged successfully");
      }
    });

    // Парсинг HTML з використанням cheerio
    const $ = cheerio.load(response.data);

    // Видалення всіх тегів <nav> і їх вмісту
    $("nav").remove();

    // Виправлення посилань у атрибутах src і href
    $('img[src^="/"]').each((_, element) => {
      const src = $(element).attr("src");
      $(element).attr("src", `https://iprop-ua.com${src}`);
    });

    $('a[href^="/"]').each((_, element) => {
      const href = $(element).attr("href");
      $(element).attr("href", `https://iprop-ua.com${href}`);
    });

    // Відправка обробленого HTML
    res.status(response.status).send($.html());
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Error fetching data" });
  }
};
