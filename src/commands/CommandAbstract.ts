import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js/node_modules/discord-api-types";

export default abstract class Command {
    
    public abstract name: string;
    public abstract description: string;

    public abstract execute(interaction: CommandInteraction) : void;

    public toJSON() : RESTPostAPIApplicationCommandsJSONBody {
        const command = new SlashCommandBuilder();

        command.setName(this.name);
        command.setDescription(this.description);

        return command.toJSON();
    }
}