import { Client, Collection } from "discord.js";
import CommandAbstract from "./CommandAbstract";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { token, clientId } from "../../resources/json/secret.json";
import fs from "node:fs";

export default class CommandListener {

    public commands = new Collection<string, CommandAbstract>();

    public async load(client: Client) : Promise<CommandListener> {
        // Get commands instances :
        for(const file of fs.readdirSync(__dirname + "/list").filter(file => file.endsWith(".ts"))){
            const importTemp = await import("./list/" + file);
            const contructorName = Object.keys(importTemp)[0];

            const command: CommandAbstract = new importTemp[contructorName]();

            this.commands.set(command.name, command);
        }

        // Register slash commands :
        this.registerCommands();

        // Start commands event :
        client.on("interactionCreate", async interaction => {
            if(!interaction.isCommand()) return;
            
            const command = this.commands.get(interaction.commandName);

            if(!command) return;

            command.execute(interaction);
        });

        return this;
    }

    public async registerCommands() : Promise<void> {
        // Get command data :
        const commands = this.commands.map(command => command.toJSON());
    
        // Rest connection :
        const rest = new REST({ version: "9" }).setToken(token);
    
        // Deploy commands :
        try {
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
    
            console.log("Successfully registered application commands.")
        } catch (error){
            console.error(error);
        }
    }
}