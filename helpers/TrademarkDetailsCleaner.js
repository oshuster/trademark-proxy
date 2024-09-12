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

  // Знаходимо <div class="text-center my-4">, який містить <!-- tm-biblio-bottom -->
  const biblioBottom = bodyElement
    .find("div.text-center.my-4")
    .filter((_, el) => $(el).html().includes("<!-- tm-biblio-bottom -->"));

  // Видаляємо все після елемента, що містить <!-- tm-biblio-bottom -->
  biblioBottom.nextAll().remove();

  // Оновлюємо шляхи до локальних зображень
  $('img[src^="/"]').each((_, element) => {
    const src = $(element).attr("src");
    $(element).attr("src", `https://iprop-ua.com${src}`);
  });

  // Оновлюємо шляхи до локальних посилань
  $('a[href^="/"]').each((_, element) => {
    const href = $(element).attr("href");

    $(element).attr("href", `${URL_HREF}${href}`);
    $(element).attr("data-id", `${href}`);
  });

  // Перетворюємо посилання без класу 'ulink' на <span> з класом 'tm-holder'
  $("a:not(.ulink)").each((_, element) => {
    const href = $(element).attr("href");
    const text = $(element).text();

    // Замінюємо <a> на <span>
    $(element).replaceWith(
      `<span class="tm-holder" data-id="${href}">${text}</span>`
    );
  });

  return {
    html: bodyElement.html(),
  };
};
