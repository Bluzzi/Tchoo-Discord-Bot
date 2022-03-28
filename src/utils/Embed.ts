import { ColorResolvable, MessageEmbed, MessageOptions, MessagePayload } from "discord.js";
import { primaryColor } from "../../resources/json/information.json";
import { CaptchaGenerator } from "captcha-canvas";

interface CaptchaEmbed {
    messageOptions: string | MessageOptions | MessagePayload;
    captchaText: string;
}

export default class Embed {

    public static simple(description: string, title: string | null = null) : MessageEmbed {
        const embed = new MessageEmbed();

        embed.setColor(<ColorResolvable>primaryColor);
        embed.setDescription(description.replace(new RegExp("/lb", "g"), "\n"));
        if(title) embed.setTitle(title);

        return embed;
    }

    public static async captcha(options: MessageOptions) : Promise<CaptchaEmbed> {
        const captcha = new CaptchaGenerator()
            .setDimension(100, 350)
            .setCaptcha({ size: 50, color: primaryColor })
            .setDecoy({ opacity: 0.5, total: 15 })
            .setTrace({ color: primaryColor })
            .setBackground(__dirname + "/../../resources/image/white.png");

        const buffer = await captcha.generate();
        const imageName = "captcha.png";

        const embed = this.simple(
            "Please write in the chat the letters and numbers displayed in " +
            "purple below to verify that you are not a robot :", 
            "Are you a robot?"
        ).setImage("attachment://" + imageName);

        options.embeds = [embed];
        options.files = [{ attachment: buffer, name: imageName }];

        return {
            messageOptions: options,
            captchaText: captcha.text ?? ""
        };
    }
}