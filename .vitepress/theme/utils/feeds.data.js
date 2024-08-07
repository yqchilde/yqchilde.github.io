import fs from 'fs';
import Parser from 'rss-parser';

let parser = new Parser();

let feeds = [
    "https://weekly.tw93.fun/rss.xml",
    "https://blog.j2gg0s.com/feed.xml",
    "https://tech.meituan.com/feed/",
    "https://tech.qimao.com/rss/",
    "https://wechat2rss.xlab.app/feed/f3a42bd249ec6e8834ae761d8d0f85a949950944.xml",
];

(async () => {
    let result = [];

    for (let feed_link of feeds) {
        try {
            let feed = await parser.parseURL(feed_link);
            let data = {
                name: feed.title,
                items: feed.items.map(item => ({
                    name: feed.title,
                    title: item.title,
                    link: item.link,
                    date: item.isoDate
                }))
            };
            result.push(data);
        } catch (error) {
            console.error(`Error parsing feed ${feed_link}:`, error);
        }
    }

    // Write to the file feeds-sub-data.json
    fs.writeFileSync('feeds-sub-data.json', JSON.stringify(result, null, 0));
})();
