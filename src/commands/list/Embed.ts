import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v9";
import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import CommandAbstract from "../CommandAbstract";
import { primaryColor } from "../../../resources/json/information.json";

export default class Embed extends CommandAbstract {

    constructor(){
        const command = new SlashCommandBuilder()
            .setName("embed")
            .setDescription("Send a embed message")
            .addChannelOption(option => 
                option.setName("channel")
                .setDescription("The channel to send the message in")
                .setRequired(true)
                .addChannelTypes(
                    [+ChannelType.GuildNews, +ChannelType.GuildText]
                )
            )
            .addStringOption(option =>
                option.setName("description")
                .setDescription("Embed description")
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
        const channel = await interaction.guild?.channels.fetch(
            interaction.options.getChannel("channel")?.id ?? ""
        );

        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");

        const embed = new MessageEmbed().setDescription(description ?? "").setColor(<ColorResolvable>primaryColor);
        if(title) embed.setTitle(title);

        if(channel && (channel.type === "GUILD_NEWS" || channel.type === "GUILD_TEXT")){
            channel.send({ content: " ", embeds: [embed] });

            interaction.reply({ content: "The embed has been sent", ephemeral: true });
        } else {
            interaction.reply({ content: "An error has occurred", ephemeral: true });
        }
    }
}