import * as cheerio from "cheerio";

export const TrademarkDetailsCleaner = (body) => {
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

  return {
    html: bodyElement.html(),
  };
};
