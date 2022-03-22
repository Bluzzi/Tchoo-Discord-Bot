import { client } from "../../Client";
import EventAbstract from "../EventAbstract";
import { guildId } from "../../../resources/json/secret.json";

export default class Ready extends EventAbstract {
    
    public name: string = "ready";
    public once = true;

    public async execute() : Promise<void> {
        (await client.guilds.fetch(guildId)).me?.setNickname("Tchoos");
        client.user?.setActivity({ type: "LISTENING", name: "your commands (do /)" })

        console.log("[Tchoos BOT] Client is ready !"); // TODO : use log system
    }
}