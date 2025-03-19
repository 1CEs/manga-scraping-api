import { Hono } from "hono";
import { mangaRouter } from "./routes/manga";

const app = new Hono().basePath("/");

app.get("/", (c) => {
    return c.json({ message: "Hello, World!" })
})

app.route("/manga", mangaRouter)

export default app
 