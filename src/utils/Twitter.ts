import { twitterToken } from "../../resources/json/secret.json";
import { twitterAccount } from "../../resources/json/information.json";
import { jsonFetch } from "./Fetch";

interface Tweet {
    id: string;
    text: string;
}

const authorization = {
    authorization: "Bearer " + twitterToken
}

export default class Twitter {

    private static instance: Twitter;

    private accountId: string;

    constructor(accountId: string){
        if(Twitter.instance){
            throw new Error("Use the static getInstance() method to get the unique instance of this class");
        }

        this.accountId = accountId;
    }

    public static async getInstance() : Promise<Twitter> {
        if(!Twitter.instance){
            const response = await jsonFetch<any>("https://api.twitter.com/2/users/by/username/" + twitterAccount, {
                headers: authorization
            });

            Twitter.instance = new Twitter(response.body.id);
        }

        return Twitter.instance;
    }

    /**
     * @returns the last 10 tweets
     */
    public async getTweets() : Promise<Tweet[]> {
        const response = await jsonFetch<{ data: Tweet[] }>(
            "https://api.twitter.com/2/users/" + this.accountId + "/tweets?exclude=retweets,replies", 
            {
                headers: authorization
            }
        );

        return response.body.data;
    }

    public async getFollowersCount() : Promise<number> {
        const response = await jsonFetch<any>("https://api.twitter.com/2/users/by/username/TheTchoos?user.fields=public_metrics", {
            headers: authorization
        });
        
        return response.body.data["public_metrics"]["followers_count"] ?? 0;
    }
}