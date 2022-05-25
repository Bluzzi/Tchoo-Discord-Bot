import TaskAbstract from "../TaskAbstract";
import { channels, guildId, twitterAccount } from "../../../resources/json/information.json";
import Twitter from "../../utils/Twitter";
import { client } from "../../Client";
import { MessageActionRow, MessageButton } from "discord.js";
import lastTweetCollection from "../../database/collections/LastTweets";

export default class PostTweets extends TaskAbstract {

    public time: number = 1000 * 60;

    public async execute() : Promise<void> {
        const tweetsChannel = await (await client.guilds.fetch(guildId)).channels.fetch(channels.tweets);

        const twitter = await Twitter.getInstance();

        const lastTweets = await twitter.getTweets();
        const postedTweets = (await lastTweetCollection.find().toArray()).map(element => element._id);

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

                // Add the tweet in posted tweet database :
                await lastTweetCollection.insertOne({ _id: tweet.id });
            }
        }
    }
}