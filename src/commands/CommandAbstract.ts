import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default abstract class Command {

    public readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

    constructor(slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">){
        this.slashCommand = slashCommand;
    }

    get name() : string {
        return this.slashCommand.name;
    }

    get description() : string {
        return this.slashCommand.description;
    }

    public abstract execute(interaction: CommandInteraction) : void;
}