import { Client, Intents } from "discord.js";
import { token } from "../resources/json/secret.json";
import CommandListener from "./commands/CommandListener";
import EventListener from "./events/EventListener";

// Create client instance :
const allIntents = new Intents(32767);

export const client = new Client({ intents: allIntents });

// Start events and commands listeners :
export const eventListener = new EventListener().load(client);
export const commandListener = new CommandListener().load(client);

// Login the client :
client.login(token);