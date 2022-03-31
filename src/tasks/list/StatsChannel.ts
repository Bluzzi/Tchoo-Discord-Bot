import TaskAbstract from "../TaskAbstract";
import { channels, guildId } from "../../../resources/json/information.json";
import Twitter from "../../utils/Twitter";
import Func from "../../utils/Func";
import { client } from "../../Client";

export default class StatsChannel extends TaskAbstract {

    public time: number = 1000 * 60 * 5;

    public async execute() : Promise<void> {
        const guild = await client.guilds.fetch(guildId);

        const twitterChannel = await guild.channels.fetch(channels.voice.twitter);
        const discordChannel = await guild.channels.fetch(channels.voice.discord);

        const twitterAccount = await Twitter.getInstance();

        // Twitter channel update :
        const followersCount = await twitterAccount.getFollowersCount();

        twitterChannel.setName(twitterChannel.name.replace(/\+?[0-9]*\.?[0-9]+k?/, Func.shortNumber(followersCount)));

        // Discord update :
        discordChannel.setName(discordChannel.name.replace(/\+?[0-9]*\.?[0-9]+k?/, Func.shortNumber(guild.memberCount)));
    }
}