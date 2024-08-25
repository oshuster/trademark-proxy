import * as cheerio from "cheerio";
import "dotenv/config";

const URL_HREF = process.env.URL_HREF || "";

export const trademarkDetailsHtmlCleaner = (body) => {
  const $ = cheerio.load(body);

  // Витягуємо з всього html тільки body
  const bodyElement = $("body");

  // Видаляємо header
  bodyElement.find("header").remove();

  // Видаляємо всі скрипти
  bodyElement.find("script").remove();

  // Видаляємо всі теги <ins>
  bodyElement.find("ins").remove();

  // Видаляємо посилання на Facebook
  bodyElement.find('a[href*="facebook.com/sharer"]').remove();

  $('img[src^="/"]').each((_, element) => {
    const src = $(element).attr("src");
    $(element).attr("src", `https://iprop-ua.com${src}`);
  });

  $('a[href^="/"]').each((_, element) => {
    const href = $(element).attr("href");
    const encodedHref = encodeURIComponent(href);

    $(element).attr("href", `${URL_HREF}/${encodedHref}`);
    $(element).attr("data-id", `${href}`);
    $(element).removeAttr("target");
  });

  return {
    html: bodyElement.html(),
  };
};
