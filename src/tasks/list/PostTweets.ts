import TaskAbstract from "../TaskAbstract";
import { channels, guildId, twitterAccount } from "../../../resources/json/information.json";
import Twitter from "../../utils/Twitter";
import { client } from "../../Client";
import fs from "node:fs";
import { MessageActionRow, MessageButton } from "discord.js";

export default class PostTweets extends TaskAbstract {

    public time: number = 1000 * 60;

    public async execute() : Promise<void> {
        const postedTweetsPath = __dirname + "/../../../resources/data/last-tweets.json";

        if(!fs.existsSync(postedTweetsPath)) fs.appendFileSync(postedTweetsPath, "[]");

        const tweetsChannel = await (await client.guilds.fetch(guildId)).channels.fetch(channels.tweets);

        const twitter = await Twitter.getInstance();

        const lastTweets = await twitter.getTweets();
        const postedTweets: string[] = JSON.parse(fs.readFileSync(postedTweetsPath, "utf-8"));

        for(const tweet of lastTweets){
            if(!postedTweets.includes(tweet.id)){
                // Post the tweet :
                if(tweetsChannel && tweetsChannel.type === "GUILD_NEWS"){
                    const row = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setURL("https://twitter.com/intent/retweet?tweet_id=" + tweet.id)
                            .setStyle("LINK").setEmoji("🔁"),
                        new MessageButton()
                            .setURL("https://twitter.com/intent/like?tweet_id=" + tweet.id)
                            .setStyle("LINK").setEmoji("❤️")
                    ]);
                    
                    const message = await tweetsChannel.send({ 
                        content: "https://twitter.com/" + twitterAccount + "/status/" + tweet.id,
                        components: [row]
                    });

                    message.crosspost();
                }

                // Add the tweet in posted tweet array :
                postedTweets.push(tweet.id);
            }
        }

        // Update posted tweets :
        fs.writeFileSync(postedTweetsPath, JSON.stringify(postedTweets, null, 4));
    }
}