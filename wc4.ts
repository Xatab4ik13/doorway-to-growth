import { kashirskyNews } from "./src/content/news/kashirsky";
import { dekoratorNews } from "./src/content/news/dekorator";

function countWords(blocks: any[]) {
  let words = 0;
  for (const b of blocks) {
    if (b.type === "p" || b.type === "quote") {
      words += b.text.trim().split(/\s+/).filter(Boolean).length;
    } else if (b.type === "ul") {
      for (const it of b.items) words += it.trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

for (const a of [...kashirskyNews, ...dekoratorNews]) {
  console.log(a.slug, countWords(a.blocks), "readingMinutes:", a.readingMinutes);
}
