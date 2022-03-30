import { CaptchaGenerator } from "captcha-canvas";
import { Collection, GuildMember, TextChannel } from "discord.js";
import { primaryColor, channels, roles } from "../../resources/json/information.json";
import Embed from "./Embed";

const kickTime = 1000 * 60 * 3; // 3 minutes

export class Captcha {

    /** Array of Captcha instance by member ID */
    public static membersInVerify = new Collection<string, Captcha>();

    private captcha: CaptchaGenerator;
    private text: string;

    private member: GuildMember;

    constructor(member: GuildMember){
        // Generate captcha and get the text :
        this.captcha = new CaptchaGenerator()
            .setDimension(100, 350)
            .setCaptcha({ size: 50, color: primaryColor })
            .setDecoy({ opacity: 0.5, total: 15 })
            .setTrace({ color: primaryColor })
            .setBackground(__dirname + "/../../resources/image/white.png");

        this.text = this.captcha.text;

        // Save the member : 
        this.member = member;

        // Save this instance : 
        Captcha.membersInVerify.set(member.id, this);
    }

    public async startVerify(mentionText: string = "") : Promise<void> {
        // Get channels channel :
        const capchaChannel = await this.member.guild.channels.fetch(channels.captcha);
        const generalChannel = await this.member.guild.channels.fetch(channels.general);

        if(!capchaChannel || capchaChannel.type !== "GUILD_TEXT") return;
        if(!generalChannel || generalChannel.type !== "GUILD_TEXT") return;

        // Send captcha :
        this.sendCaptchaEmbed(capchaChannel, mentionText);

        // Collect response :
        const messageCollector = capchaChannel.createMessageCollector({
            filter: message => message.author.id === this.member.id,
            time: kickTime
        });

        messageCollector.on("collect", message => {
            if(message.content === this.text){
                this.member.roles.add(roles.joinRole);
                
                generalChannel.send({ embeds: [Embed.simple("Welcome to the Tchoos community <@" + this.member.id + "> ! 👽")] });

                Captcha.membersInVerify.delete(this.member.id);
            } else {
                this.sendCaptchaEmbed(capchaChannel, "<@" + this.member.id + ">, you must complete the following instructions:");
            }

            setTimeout(() => message.delete(), 3000);
        });

        messageCollector.on("end", () => {
            if(!this.member.roles.cache.has(roles.joinRole)) this.member.kick();

            Captcha.membersInVerify.delete(this.member.id);
        });
    }

    private async sendCaptchaEmbed(channel: TextChannel, mentionText: string = "") : Promise<void> {
        const buffer = await this.captcha.generate();
        const imageName = "captcha.png";

        const embed = Embed.simple(
            "Please write in the chat the letters and numbers displayed in " +
            "purple below to verify that you are not a robot :", 
            "Are you a robot?"
        ).setImage("attachment://" + imageName);

        const message = await channel.send({
            content: mentionText, 
            embeds: [embed], 
            files: [{ attachment: buffer, name: imageName }] 
        });

        setTimeout(() => message.delete(), kickTime);
    }
}