import express from "express";
import { FSRouter } from "./FSRouter";

const app = express();
const router = new FSRouter(app);
router.useFileSystemRouting();

app.get("/", (req, res) => { res.send("hi") });
app.listen(3000, () => { console.log("Server started on http://localhost:3000") })

