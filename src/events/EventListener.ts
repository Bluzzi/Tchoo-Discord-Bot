import { Client } from "discord.js";
import EventAbstract from "./EventAbstract";
import fs from "node:fs";

export default class EventListener {

    public async load(client: Client) : Promise<EventListener> {
        for(const file of fs.readdirSync(__dirname + "/list")){
            const importTemp = await import("./list/" + file);
            const contructorName = Object.keys(importTemp)[0];
        
            const event: EventAbstract = new importTemp[contructorName]();
        
            client[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args));
        }

        return this;
    }
}