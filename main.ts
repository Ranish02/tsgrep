import { parseArguments } from "./argument";
import { colors } from "./colors";


async function main(){
    console.log(`\n\t\t\t${colors.cyan} Welcome to Tsgrep ! ${colors.reset}\n`);
    const args : string[] = process.argv.slice(2);
    await parseArguments(args);
    return console.log("Program exited!");
}

main();