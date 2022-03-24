import { GuildMember } from "discord.js";
import EventAbstract from "../EventAbstract";
import { channels, rateLimit, roles } from "../../../resources/json/information.json";
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
            member.roles.add(roles.joinRole);

            return;
        }

        // Get capcha channel :
        const capchaChannel = await member.guild.channels.fetch(channels.captcha);

        if(!capchaChannel || capchaChannel.type !== "GUILD_TEXT") return;

        // Create the captcha and send it :
        const captcha = await Embed.captcha({ content: "Hello <@" + member.id + ">" });

        capchaChannel.send(captcha.messageOptions);

        // Create message collector :
        // TODO
    }
}