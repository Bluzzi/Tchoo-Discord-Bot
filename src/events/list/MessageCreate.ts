import { Message } from "discord.js";
import EventAbstract from "../EventAbstract";

export default class MessageCreate extends EventAbstract {

    public name: string = "messageCreate";
    
    public execute(msg: Message): void {
        if(msg.author.bot) return;

        // TODO
    }
}