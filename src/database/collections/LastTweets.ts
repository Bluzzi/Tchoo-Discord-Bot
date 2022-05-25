import database from "../Database";

export interface LastTweet {
    _id: string;
}

const lastTweetCollection = database.collection<LastTweet>("lasttweets");
export default lastTweetCollection;