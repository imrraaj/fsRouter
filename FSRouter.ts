import fs from "node:fs";
import { Express } from "express";
import path from "node:path";

export class FSRouter {
    private app: Express;
    private root_dir: string;

    constructor(app: Express, root_dir: string = "src") {
        this.app = app;
        this.root_dir = root_dir;
    }

    private async walkDir(directory: string) {
        for (const fileName of fs.readdirSync(directory)) {
            const filePath = path.join(directory, fileName);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory() && fileName != "node_modules") {
                this.walkDir(filePath);
            } else if (fileStat.isFile()) {
                const route_path = path.join(__dirname, directory, "route");
                console.log(directory)
                const route_url = directory.replace(this.root_dir, "").replace(/\\/g, "/")
                console.log(route_path)
                console.log({ route_url, directory })
                const m = await import(route_path);
                if (m.default == undefined) {
                    throw new Error(`Router is not default exported from ${route_path}`)
                }
                this.app.use(route_url, m.default);
            }
        }
    }
    useFileSystemRouting() {
        this.walkDir(this.root_dir);
    }
}