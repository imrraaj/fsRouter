import { Router } from "express";

const r = Router()

r.get("/", (_, res) => { res.send("about/blog") })

export default r;
