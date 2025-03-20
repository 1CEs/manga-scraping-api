import { Scraping } from "./scraping";

export class TCScraping extends Scraping {
    private declare selector: TopChartSelector;
    constructor(url: string, selector: TopChartSelector = "DEFAULT") {
        super(url);
        this.selector = selector
    }

    scraping = async () => {
        switch (this.selector) {
            case "DEFAULT": return this.default()
        }
    }

    private default = async () => {
        const tcWrappers = await this.page.$(".popconslide");
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
        return mangas;
    }

}

(async () => {
    const tcs = new TCScraping("https://speed-manga.com/")
    await tcs.init()
    const mangas = await tcs.scraping()
    console.log(mangas)
    await tcs.close()
})();


