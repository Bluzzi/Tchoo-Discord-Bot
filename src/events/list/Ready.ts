import EventAbstract from "../EventAbstract";

export default class Ready extends EventAbstract {
    
    public name: string = "ready";
    public once = true;

    public execute() : void {
        console.log("Client is ready !"); // TODO : better message with log system ?
    }
}