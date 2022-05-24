import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default abstract class Command {

    public readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    public readonly defaultPermission: boolean;

    constructor(
        slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, 
        defaultPermission: boolean
    ){
        this.slashCommand = slashCommand;
        this.defaultPermission = defaultPermission;
    }

    get name() : string {
        return this.slashCommand.name;
    }

    get description() : string {
        return this.slashCommand.description;
    }

    public abstract execute(interaction: CommandInteraction) : void;
}