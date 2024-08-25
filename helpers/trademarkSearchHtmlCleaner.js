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

  $('a[href^="/"]').each((_, element) => {
    const href = $(element).attr("href");
    const encodedHref = encodeURIComponent(href);

    $(element).attr("href", `${URL_HREF}/${encodedHref}`);
    $(element).attr("data-id", `${href}`);
    $(element).removeAttr("target");
  });

  return {
    html: $.html(),
    navigation: navigation,
    pages: liCount,
  };
};
