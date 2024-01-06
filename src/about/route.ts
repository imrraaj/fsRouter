import { Router } from "express";

const r = Router()

r.get("/", (_, res) => { res.send("about") })
r.get("/:id", (req, res) => { res.send(`${req.params.id}`) })

export default r;
