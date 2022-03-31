import { ApplicationCommandPermissionData, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default abstract class Command {

    public readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    public readonly permissions: ApplicationCommandPermissionData[];

    constructor(
        slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, 
        permissions: ApplicationCommandPermissionData[]
    ){
        this.slashCommand = slashCommand;
        this.permissions = permissions;
    }

    get name() : string {
        return this.slashCommand.name;
    }

    get description() : string {
        return this.slashCommand.description;
    }

    public abstract execute(interaction: CommandInteraction) : void;
}