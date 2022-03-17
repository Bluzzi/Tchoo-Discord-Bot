export default abstract class EventAbstract {
    
    public abstract name: string;
    public once: boolean = false;

    public abstract execute(...args: any) : void;
}