import { ColorResolvable, MessageEmbed } from "discord.js";
import { primaryColor } from "../../resources/json/information.json";

export default class Embed {

    public static simple(description: string, title: string | null = null) : MessageEmbed {
        const embed = new MessageEmbed();

        embed.setColor(<ColorResolvable>primaryColor);
        embed.setDescription(description.replace(new RegExp("/lb", "g"), "\n"));
        if(title) embed.setTitle(title);

        return embed;
    }
}