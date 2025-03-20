import { Scraping } from "./scraping";

export class TCScraping extends Scraping {
    private declare selector: TopChartSelector;
    constructor(url: string, selector: TopChartSelector = "DEFAULT") {
        super(url);
        this.selector = selector
    }

    scraping = async () => {
        switch (this.selector) {
            case "DEFAULT": return this.byDefault()
            default: return this.byCategory(this.selector)
        }
    }

    private byCategory = async (sel: TopChartSelector) => {
        const tcWrappers = await this.page.$(`.wpop-${sel.toLowerCase()}`)
        if (!tcWrappers) {
            console.error("Error: .popconslide not found");
            return;
        }

        const boxesEl = await tcWrappers.$$("ul > li");
        if (!boxesEl) return;

        let mangas: Array<Object> = [];
        for (let i = 0; i < boxesEl.length; i++) {
            const box = boxesEl[i];

            if (!box) return;

            const title = await box.$eval("div.leftseries > h2 > a.series", a => a.innerText);
            const thumb = await box.$eval("div.imgseries > a.series > img", img => img.src);
            const rating = await box.$eval("div.leftseries > div.rt > div.rating > div.numscore", div => div.innerText);

            const genreEls = await box.$$("div.leftseries > span > a");
            let genres: Array<string> = []

            for(let i: number = 0; i < genreEls.length; i++) {
                const genreEl = genreEls[i]
                const genre = await genreEl?.evaluate(a => a.innerText)
                genres = [...genres, genre]
            }

            mangas = [...mangas, { title, thumb, genres, rating }];
        }
        return mangas;
    }

    private byDefault = async () => {
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

            mangas = [...mangas, { title, eps, thumb, type, rating }];
        }
        return mangas;
    }

}

(async () => {
    const tcs = new TCScraping("https://speed-manga.com/", "WEEKLY")
    await tcs.init()
    const mangas = await tcs.scraping()
    console.log(mangas)
    await tcs.close()
})();


