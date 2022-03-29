import EventAbstract from "../EventAbstract";
import { roles, channels } from "../../../resources/json/information.json";
import { 
    AllowedThreadTypeForTextChannel, GuildMember, ThreadCreateOptions, 
    Interaction, MessageActionRow, MessageButton, TextChannel, ThreadChannel 
} from "discord.js";
import Embed from "../../utils/Embed";

export default class ButtonInteraction extends EventAbstract {
    
    public name: string = "interactionCreate";

    /** Contains the list of members ID who are in the anti-spam queue  */
    private ticketAntiSpam: string[] = [];

    public async execute(interaction: Interaction) : Promise<void> {
        if(!interaction.isButton()) return;

        switch(interaction.customId){
            case "ticket-create":
                if(interaction.member instanceof GuildMember){
                    // Check if member have the base role :
                    if(!interaction.member.roles.cache.has(roles.joinRole)){
                        interaction.reply({ 
                            embeds: [Embed.simple("You must complete the captcha in <#" + channels.captcha + "> to open a ticket.")], 
                            ephemeral: true 
                        });

                        return;
                    }

                    // And spam queue :
                    const memberId = interaction.member.id;

                    if(this.ticketAntiSpam.includes(memberId)){
                        interaction.reply({ 
                            embeds: [Embed.simple("You have to wait before you can create a ticket again.")], 
                            ephemeral: true 
                        });

                        return;
                    } else {
                        this.ticketAntiSpam.push(memberId);

                        setTimeout(() => {
                            const index = this.ticketAntiSpam.indexOf(memberId); 

                            if(index !== -1) this.ticketAntiSpam.splice(index, 1);
                        }, 1000 * 60 * 15); // 15 minutes
                    }

                    // Create the ticket :
                    const threadChannel = await this.ticketCreate(interaction.member);

                    if(threadChannel){
                        interaction.reply({ 
                            embeds: [Embed.simple("Your ticket has been opened here : <#" + threadChannel.id + ">")], 
                            ephemeral: true 
                        });
                    } else {
                        interaction.reply({ 
                            embeds: [Embed.simple("An error has occurred, try again later or contact a staff member.")], 
                            ephemeral: true 
                        });
                    }
                }
            break;

            case "ticket-delete":
                if(
                    interaction.channel &&
                    (interaction.channel.type === "GUILD_PRIVATE_THREAD" || 
                    interaction.channel.type === "GUILD_PUBLIC_THREAD")
                ){
                    await interaction.reply({ embeds: [Embed.simple("This ticket is now archived!")] });
                    interaction.channel.setArchived(true);
                }
            break;
        }
    }

    private async ticketCreate(member: GuildMember) : Promise<ThreadChannel|undefined> {
        const channel = await member.guild.channels.fetch(channels.ticket);

        if(!(channel?.type === "GUILD_TEXT")) return;

        // Create the thread (private if guild level is two) with permissions :
        const threadConfig: ThreadCreateOptions<AllowedThreadTypeForTextChannel> = {
            name: member.user.tag,
            autoArchiveDuration: 1440
        }

        if(channel.guild.premiumTier === "TIER_2") threadConfig.type = "GUILD_PRIVATE_THREAD";

        const threadChannel = await channel.threads.create(threadConfig);

        threadChannel.setLocked(false);
        threadChannel.permissionsFor(member);

        for(const roleName of Object.values(roles.staffRoles)){
            const role = await channel.guild.roles.fetch(roleName);

            if(role) threadChannel.permissionsFor(role);
        }

        // Remove automatic message sent in the ticket channel :
        (await threadChannel.fetchStarterMessage()).delete(); // TODO : check if this is required for low level guild

        // Send the confirmation (and remover) message in the thread :
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("ticket-delete")
                .setLabel("Delete this ticket")
                .setStyle("DANGER")
                .setEmoji("🗑️")
        )

        threadChannel.send({
            content: "Welcome <@" + member.id + ">, <@&" + roles.staffRoles["Community Manager"] + ">", 
            embeds: [Embed.simple("Ask your question, when a staff is available, it will come to answer you.")],
            components: [row]
        });

        // Return the thread instance :
        return threadChannel;
    }
}