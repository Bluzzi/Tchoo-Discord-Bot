import { client } from "../../Client";
import EventAbstract from "../EventAbstract";

export default class Ready extends EventAbstract {
    
    public name: string = "ready";
    public once = true;

    public execute() : void {
        client.user?.setUsername("The Tchoos");
        client.user?.setActivity({ type: "LISTENING", name: "your commands (do /)" })

        console.log("[Tchoos BOT] Client is ready !");
    }
}