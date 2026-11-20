import { parseArguments } from "./argument.ts";
import { colors } from "./colors.ts";

async function main(){
    const args : string[] = process.argv.slice(2);
    await parseArguments(args);
    return console.log("Program exited!");
}

main();