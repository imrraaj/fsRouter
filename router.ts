import fs from "node:fs";
import express, { Express } from "express";
import path from "node:path";
import { opendir } from "node:fs/promises"

class FSRouter {
    private app: Express;
    private root_dir: string;

    constructor(app: Express, root_dir: string = "src") {
        this.app = app;
        this.root_dir = root_dir;
    }

    async walkDir(dir: string, app: Express) {
        // const curr_dir_path = path.join(dir.path, dir.name);
        // const dir_content = fs.readdirSync(curr_dir_path);

        for (const fileName of fs.readdirSync(dir)) {
            const filePath = path.join(dir, fileName);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory() && fileName != "node_modules") {
                this.walkDir(filePath, app);
            } else if (fileStat.isFile()) {
                const route_path = path.join(__dirname, filePath, "route");
                console.log(route_path)
                const m = await import(route_path);

                if (m.default == undefined) {
                    throw new Error("Route not found")
                }
                const route_url = filePath.replace(root_dir, "").replace(/\\/g, "/")
                app.use(route_url, m.default);
            }
        }
    }
}



const root_dir = "src"
async function getDirs(dir_path: string = "./") {
    const dirs: fs.Dirent[] = [];

    const dir = await opendir(dir_path);
    for await (const dirent of dir)
        if (dirent.isDirectory() && dirent.name != "node_modules")
            dirs.push(dirent);

    return dirs;
}

async function walkDir(dir: fs.Dirent, app: Express) {
    const curr_dir_path = path.join(dir.path, dir.name);
    const dir_content = fs.readdirSync(curr_dir_path);
    if (dir_content.includes("route.ts")) {
        const route_path = path.join(__dirname, curr_dir_path, "route");
        const m = await import(route_path);

        if (m.default == undefined) {
            throw new Error("Route not found")
        }
        const route_url = curr_dir_path.replace(root_dir, "").replace(/\\/g, "/")
        app.use(route_url, m.default);
    }

    const sub_dirs = await getDirs(curr_dir_path);
    sub_dirs.forEach(sub_dir => {
        walkDir(sub_dir, app);
    })
}

export default function main(app: Express) {
    getDirs().then(dirs => Promise.all(dirs.map(dir => walkDir(dir, app))))
}
