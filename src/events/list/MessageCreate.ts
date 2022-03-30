import EventAbstract from "../EventAbstract";
import { Message } from "discord.js";
import { Captcha } from "../../utils/Captcha";
import { roles } from "../../../resources/json/information.json";

export default class MessageCreate extends EventAbstract {
    
    public name: string = "messageCreate";

    public async execute(message: Message) : Promise<void> {
        if(message.author.bot) return;
        
        const member = message.member;
    
        // Check if member have the default role :
        if(!member.roles.cache.has(roles.joinRole) && !Captcha.membersInVerify.get(member.id)){
            const captcha = new Captcha(member);

            captcha.startVerify("Hello <@" + member.id + ">"); 
        }      
    }
}