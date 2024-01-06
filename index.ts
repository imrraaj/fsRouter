import express from "express";
import fsRouter from "./router";

const app = express();
fsRouter(app);

app.get("/", (req, res) => { res.send("hi") });
app.listen(3000, () => { console.log("Server Started") })

