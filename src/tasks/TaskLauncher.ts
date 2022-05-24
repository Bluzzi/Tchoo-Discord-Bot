import TaskAbstract from "./TaskAbstract";
import fs from "node:fs";

export default class TaskLauncher {

    public async load() : Promise<void> {
        for(const file of fs.readdirSync(__dirname + "/list")){
            const importTemp = await import("./list/" + file);
            const contructorName = Object.keys(importTemp)[0];
        
            const task: TaskAbstract = new importTemp[contructorName]();
        
            setInterval(() => task.execute(), task.time);
        }
    }
}