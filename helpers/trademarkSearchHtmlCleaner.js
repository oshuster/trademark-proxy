import * as cheerio from "cheerio";
import "dotenv/config";

const URL_HREF = process.env.URL_HREF || "";

export const trademarkSearchHtmlCleaner = (body) => {
  const $ = cheerio.load(body);

  // Витягуємо навігацію і зберігаємо її в окрему змінну
  const navigationElement = $("nav");

  // Видаляємо перший і останній елементи навігації, що відповідають зазначеному шаблону
  // для прибирання стрілок навігації в <li>
  navigationElement.find("li.page-item").first().remove();
  navigationElement.find("li.page-item").last().remove();

  // Зберігаємо навігацію окремо
  const navigation = navigationElement.html();
  const liCount = navigationElement.find("li.page-item").length;

  // Видаляємо навігацію з основного HTML
  navigationElement.remove();

  $('img[src^="/"]').each((_, element) => {
    const src = $(element).attr("src");
    $(element).attr("src", `https://iprop-ua.com${src}`);
  });

  // Оновлюємо кожен div.tm-thumb
  $("div.tm-thumb").each((_, element) => {
    const $thumb = $(element);
    const $link = $thumb.find('a[href^="/"]');

    if ($link.length) {
      let href = $link.attr("href"); // Отримуємо href з <a>
      if (href) {
        href = href.slice(1); // Видаляємо перший символ (слеш)
      }
      const text = $link.text().trim(); // Отримуємо текст з <a>
      const $img = $link.find("img"); // Знаходимо <img> всередині <a>

      // Додаємо атрибут data-id до div.tm-thumb без початкового слеша
      if (href) {
        $thumb.attr("data-id", href);
      }

      // Створюємо новий <span class="tm-id"> з текстом
      const $span = $(`<span class="tm-id">${text}</span>`);

      if ($span.text().length) {
        const tmName = $span.text().trim();
        if (tmName) {
          $thumb.attr("data-name", tmName); // Додаємо його як data-name
        }
      }

      // Якщо є <img>, зберігаємо його поза <a>
      if ($img.length) {
        // Видаляємо <img> з <a>, але залишаємо в структурі
        $link.empty();
        // Вставляємо зображення перед span
        $img.insertBefore($span);
      }

      // Замінюємо <a> на нові елементи: <img> і <span class="tm-id">
      $link.replaceWith($img.add($span)); // Додаємо зображення і span одночасно
    }
  });

  return {
    html: $.html(),
    navigation: navigation,
    pages: liCount,
  };
};
