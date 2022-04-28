import { Client, Collection } from "discord.js";
import CommandAbstract from "./CommandAbstract";
import { guildId } from "../../resources/json/information.json";
import Logger from "../utils/Logger";
import fs from "node:fs";
import { client } from "../Client";

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

        // Start commands event :
        client.on("interactionCreate", async interaction => {
            if(!interaction.isCommand()) return;
            
            const command = this.commands.get(interaction.commandName);

            if(!command) return;

            command.execute(interaction);
        });

        // Register commands :
        client.once("ready", () => this.registerCommands());

        return this;
    }

    /**
     * Register the slash commands (use it when the client is ready)
     */
    public async registerCommands() : Promise<void> {
        // Get command data :
        const commands = this.commands.map(command => command.slashCommand.setDefaultPermission(false).toJSON());

        // Get command manager :
        if(!client.application?.owner) await client.application?.fetch();

        const commandManager = (await client.guilds.fetch(guildId)).commands;

        // Set commands and permissions :
        const commandsInstances = await commandManager.set(commands);

        for(const command of commandsInstances.values()){
            const permissions = this.commands.get(command.name)?.permissions;

            if(permissions) command.permissions.set({ permissions: permissions });
        }
    
        Logger.info("Successfully registered application commands");
    }
}