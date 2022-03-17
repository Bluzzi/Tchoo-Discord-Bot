import { Client, Collection, Intents } from "discord.js";
import { token } from "../resources/json/secret.json";
import CommandListener from "./commands/CommandListener";

// Create client instance :
export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

export const commandListener = new CommandListener(client);

// Login the client :
client.login(token);