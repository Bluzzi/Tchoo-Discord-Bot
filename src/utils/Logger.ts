import colors from "colors";
import { prefix } from "../../resources/json/information.json";

export default class Logger {

    public static info(message: string) : void {
        console.log(colors.yellow(prefix + " " + message));
    }

    public static warning(message: string) : void {
        console.log(colors.magenta(prefix + " " + message));
    }

    public static error(message: string) : void {
        console.error(colors.red(prefix + " " + message));
    }
}