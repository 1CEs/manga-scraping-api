import { Hono } from "hono";

export const mangaRouter = new Hono();

mangaRouter.get("/top-chart", (c) => {
    return c.json({ message: "tc" })
})
