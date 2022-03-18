import { CommandInteraction } from "discord.js";
import CommandAbstract from "../CommandAbstract";

export default class Ping extends CommandAbstract {
    
    public name: string = "ping";
    public description: string = "Play ping ping";

    public execute(interaction: CommandInteraction) : void {
        interaction.reply({ content: "Pong ! 🏓", ephemeral: true });
    }
}