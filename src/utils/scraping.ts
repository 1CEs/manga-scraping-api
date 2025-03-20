import puppeteer, { Browser, Page } from "puppeteer";

export class Scraping {
    protected declare page: Page;
    protected declare browser: Browser;
    private url: string = "";

    constructor(url: string) {
        this.url = url;
    }

    init = async () => {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        });

        this.page = await this.browser.newPage();
        await this.page.goto(this.url)
    }

    close = async () => {
        await this.browser.close()
    }

}