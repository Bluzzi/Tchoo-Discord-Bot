import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import CommandAbstract from "../CommandAbstract";
import Embed from "../../utils/Embed";
import { roles } from "../../../resources/json/information.json";

export default class Ticket extends CommandAbstract {

    constructor(){
        const command = new SlashCommandBuilder()
            .setName("ticket")
            .setDescription("Create a button to open tickets in this channel");

        super(command, false);
    }

    public async execute(interaction: CommandInteraction) : Promise<void> {
        const embed = Embed.simple(
            "This is the place to open a ticket for assistance. " +
            "Please do not ping staff in tickets unless you have not " +
            "gotten a response within 24 hours. Click the button below to open a ticket.", 
            "Open a ticket"
        );

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("ticket-create")
                .setLabel("Open a ticket")
                .setStyle("PRIMARY")
                .setEmoji("🎫")
        )

        interaction.channel?.send({ embeds: [embed], components: [row] });
        interaction.reply({ embeds: [Embed.simple("The ticket opening message has been sent")], ephemeral: true });
    }
}