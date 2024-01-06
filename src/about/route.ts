import { Router } from "express";

const r = Router()

r.get("/", (_, res) => { res.send("about") })

export default r;
