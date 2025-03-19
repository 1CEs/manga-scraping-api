import puppeteer, { Page } from "puppeteer";

const getTopChart = async (selector: TopChartSelector = "DEFAULT") => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();

    try {
        await page.goto("https://speed-manga.com/", { waitUntil: 'networkidle2', timeout: 120000 });
        defaultScraping(page);

    } catch (err) {
        console.error("Error navigating to page: ", err);
    } finally {
        await browser.close();
    }
};

const defaultScraping = async (page: Page) => {
    const tcWrappers = await page.$(".popconslide");
    if (!tcWrappers) {
        console.error("Error: .popconslide not found");
        return;
    }

    const boxesEl = await tcWrappers.$$(".bs");
    if (!boxesEl) return;

    let mangas: Array<Object> = [];
    for (let i = 0; i < boxesEl.length; i++) {
        const box = boxesEl[i];

        if (!box) return;

        const title = await box.$eval("div.bsx > a > div.bigor > div.tt", div => div.innerText);
        const eps = await box.$eval("div.bsx > a > div.bigor > div.adds > div.epxs", div => div.innerText);
        const thumb = await box.$eval("div.bsx > a > div.limit > img", img => img.src);
        const type = await box.$eval("div.bsx > a > div.limit > span", span => span.innerText);
        const rating = await box.$eval("div.bsx > a > div.bigor > div.adds > div.rt > div > div.numscore", div => div.innerText);

        console.log(title);

        mangas = [...mangas, { title, eps, thumb, type, rating }];
    }
    console.log(mangas);
}

getTopChart("DEFAULT");
