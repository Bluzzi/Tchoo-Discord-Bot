export default class Func {

    public static shortNumber(number: number) : string {
        const numberString = Math.floor(number).toString();

        if(number < 1000){
            return numberString;
        } else if(number === 1000){
            return "1k";
        } else if(number < 10000){
            return numberString[0] + "." + numberString[1] + "k";
        } else if(number === 10000){
            return "10k";
        } else if(number < 100000){
            return numberString.substring(0, 2) + "k";
        } else {
            return "+100k";
        }
    }
}