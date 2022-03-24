import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v9";
import { CommandInteraction } from "discord.js";
import CommandAbstract from "../CommandAbstract";
import EmbedCreator from "../../utils/Embed";

export default class Embed extends CommandAbstract {

    constructor(){
        const command = new SlashCommandBuilder()
            .setName("embed")
            .setDescription("Send a embed message")
            .addStringOption(option =>
                option.setName("description")
                .setDescription("Embed description (use /lb for add a breakline)")
                .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("title")
                .setDescription("Embed title")
                .setRequired(false)
            );

        super(command);
    }

    public async execute(interaction: CommandInteraction) : Promise<void> {
        if(!interaction.memberPermissions?.has("ADMINISTRATOR")){
            interaction.reply({ 
                embeds: [EmbedCreator.simple("You don't have the permission to do this command.")], 
                ephemeral: true 
            });

            return;
        }

        const channel = await interaction.guild?.channels.fetch(interaction.channel?.id ?? "");

        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");

        if(channel && (channel.type === "GUILD_NEWS" || channel.type === "GUILD_TEXT")){
            channel.send({ content: " ", embeds: [EmbedCreator.simple(description ?? "", title ?? null)] });

            interaction.reply({ embeds: [EmbedCreator.simple("The embed has been sent.")], ephemeral: true });
        } else {
            interaction.reply({ embeds: [EmbedCreator.simple("An error has occurred.")], ephemeral: true });
        }
    }
}