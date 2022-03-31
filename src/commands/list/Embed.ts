import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import CommandAbstract from "../CommandAbstract";
import EmbedCreator from "../../utils/Embed";
import { roles } from "../../../resources/json/information.json";

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

        super(
            command,
            [{
                id: roles.staffRoles.Full,
                type: "ROLE",
                permission: true
            }]
        );
    }

    public async execute(interaction: CommandInteraction) : Promise<void> {
        const channel = interaction.channel;

        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");

        if(
            channel && 
            (channel.type === "GUILD_NEWS" || channel.type === "GUILD_TEXT" || 
            channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD")
        ){
            channel.send({ content: " ", embeds: [EmbedCreator.simple(description ?? "", title ?? null)] });

            interaction.reply({ embeds: [EmbedCreator.simple("The embed has been sent.")], ephemeral: true });
        } else {
            interaction.reply({ embeds: [EmbedCreator.simple("An error has occurred.")], ephemeral: true });
        }
    }
}