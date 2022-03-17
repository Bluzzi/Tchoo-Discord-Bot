import { Client, Collection } from "discord.js";
import CommandAbstract from "./CommandAbstract";
import fs from "node:fs";

export default class CommandListener {

    public commands = new Collection<string, CommandAbstract>();

    constructor(client: Client){ 
        fs.readdirSync(__dirname + "/list").filter(file => file.endsWith(".ts")).forEach(async file => {
            const importTemp = await import("./list/" + file);
            const contructorName = Object.keys(importTemp)[0];

            const command: CommandAbstract = new importTemp[contructorName]();

            this.commands.set(command.name, command);
        });

        client.on("interactionCreate", async interaction => {
            if(!interaction.isCommand()) return;
            
            const command = this.commands.get(interaction.commandName);

            if(!command) return;

            command.execute(interaction);
        });
    }
}