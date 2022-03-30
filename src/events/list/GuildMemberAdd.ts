import { GuildMember } from "discord.js";
import EventAbstract from "../EventAbstract";
import { Captcha } from "../../utils/Captcha";
import { channels, roles, rateLimit } from "../../../resources/json/information.json";
import Embed from "../../utils/Embed";

export default class GuildMemberAdd extends EventAbstract {

    public name: string = "guildMemberAdd";

    private joinRateLimit = {
        hour: new Date().getHours(),
        count: 0
    }

    public async execute(member: GuildMember) : Promise<void> {
        // Active the captcha security if more than 30 members join on this hour :
        const currentHour = new Date().getHours();

        if(this.joinRateLimit.hour !== currentHour){
            this.joinRateLimit.hour = currentHour; 
            this.joinRateLimit.count = 1;
        } else {
            this.joinRateLimit.count++; 
        }

        // Check if the join rate limit is exceeded :
        if(this.joinRateLimit.count < rateLimit.joinActiveCaptcha){
            // Set the default role : 
            member.roles.add(roles.joinRole);

            // Send welcome message :
            const generalChannel = await member.guild.channels.fetch(channels.general);

            if(generalChannel && generalChannel.type === "GUILD_TEXT"){
                generalChannel.send({ 
                    embeds: [Embed.simple("Welcome to the Tchoos community <@" + member.id + "> ! 👽")] 
                });
            }
        
            return;
        }

        // Captcha system :
        if(!Captcha.membersInVerify.get(member.id)){
            const captcha = new Captcha(member);

            captcha.startVerify("Hello <@" + member.id + ">");
        }
    }
}