import { Client, Intents } from "discord.js";
import { token } from "../resources/json/secret.json";
import CommandListener from "./commands/CommandListener";
import EventListener from "./events/EventListener";

// Create client instance :
const allIntents = new Intents(32767);

export const client = new Client({ intents: allIntents });

export let eventListener: EventListener | null;
export let commandListener: CommandListener | null;

(async () => {
    // Start events and commands listeners :
    eventListener = await new EventListener().load(client);
    commandListener = await new CommandListener().load(client);

    // Login the client :
    client.login(token);
})();