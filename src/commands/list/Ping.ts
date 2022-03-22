import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import CommandAbstract from "../CommandAbstract";

export default class Ping extends CommandAbstract {

    constructor(){
        const command = new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Play ping pong")
            .addStringOption(option => 
                option.setName("pinger")
                .setDescription("Set the pinger")
                .setRequired(true)
                .addChoice("Ping", "ping")
                .addChoice("Pong", "pong")
            );

        super(command);
    }

    public execute(interaction: CommandInteraction) : void {
        interaction.reply({ content: "Pong ! 🏓", ephemeral: true });
    }
}