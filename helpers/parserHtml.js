import * as cheerio from "cheerio";

export const parserHtml = (body) => {
  const $ = cheerio.load(body);

  $("nav").remove();

  $('img[src^="/"]').each((_, element) => {
    const src = $(element).attr("src");
    $(element).attr("src", `https://iprop-ua.com${src}`);
  });

  $('a[href^="/"]').each((_, element) => {
    const href = $(element).attr("href");
    $(element).attr("href", `https://iprop-ua.com${href}`);
  });

  return $.html();
};
