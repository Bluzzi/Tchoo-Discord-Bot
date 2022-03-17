import { CommandInteraction } from "discord.js";

export default abstract class Command {
    
    public abstract name: string;

    public abstract execute(interaction: CommandInteraction) : void;
}