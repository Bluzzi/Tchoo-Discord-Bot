import { Client, Collection, Intents } from "discord.js";
import { token } from "../resources/json/secret.json";

// Create client instance :
export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


// Login the client :
client.login(token);