import { readFile } from "node:fs/promises";
import { opendir } from "node:fs/promises";
import { colors } from "./colors";

type stringLocation = {
    row: number,
    col: number,
    isFound: boolean,
    line: string
}

type stringWithLocation = {
    row: number,
    col: number
    line: string,
    isFound: boolean
}
function searchInLine(needle: string, line: string): stringWithLocation {
    let rs: stringWithLocation = {
        row: 0,
        col: 0,
        line: "",
        isFound: false
    }
    for (let i = 0; i < line.length; i++) {
        if (line[i] == needle[0]) {
            let isFound = true;
            for (let needleI = 1; needleI < needle.length; needleI++) {
                if (line[i + needleI] !== needle[needleI]) {
                    isFound = false;
                    break;
                }
            }
            if (isFound) {
                rs.col = i + 1;
                rs.line = line;
                rs.isFound = true;
                return rs;
            }
        }
    }
    return rs;
}

function searchWithinLines(needle: string, lines: string[]): stringLocation[] {
    let stringLocations: stringLocation[] = [];
    for (let i = 0; i < lines.length; i++) {
        const loc = searchInLine(needle, lines[i]);
        if (loc.isFound) {
            let location: stringWithLocation = {
                col: loc.col,
                row: i + 1,
                line: loc.line,
                isFound: true
            };
            stringLocations.push(location);
        }
    }
    return stringLocations;
}

async function searchTextInFile(file: string, searchString: string): Promise<stringLocation> {
    let rs: stringLocation = {
        row: 0,
        col: 0,
        isFound: false,
        line: ""
    };

    const fileContent = await readFile(file, 'ascii');
    const fileLines = fileContent.split(/\r?\n/);
    const locations = searchWithinLines(searchString, fileLines);
    if (locations.length > 0) {
        rs.isFound = true;
        for (let lineLocation of locations) {
            let pre = lineLocation.line.slice(0, lineLocation.col - 1);
            let post = lineLocation.line.slice(lineLocation.col + searchString.length - 1, lineLocation.line.length - 1);
            console.log(` ${colors.green} Found at file: ${file}:${lineLocation.row}:${lineLocation.col} ${colors.reset}`, `\n\n\t\t${pre}${colors.green}${searchString}${colors.reset}${post}`,)
            console.log(`\t\t${" ".repeat(lineLocation.col - 1)}^\n\n\t\t`)
        }
    }
    return rs;
}

async function searchTextInDirectory(dirName: string, searchString: string, depth: number): Promise<boolean> {
    const dir = await opendir(dirName);
    if (dir == undefined) {
        return false
    };
    for await (const item of dir) {
        if (item.isDirectory()) {
            const fullDirName = dirName + "/" + item.name;
            console.log('\t'.repeat(depth), "-", fullDirName)
            await searchTextInDirectory(fullDirName, searchString, depth + 1);
        } else {
            const rs = await searchTextInFile(dir.path + "/" + item.name, searchString);
            if (rs.isFound) {
                console.log('\t'.repeat(depth), colors.green, item.name, `${colors.reset}`);
            } else {
                console.log('\t'.repeat(depth), "-", item.name);
            }
        }
    }
    dir.close();
    return false;
}

async function readDirectory(dirName: string, depth: number): Promise<boolean> {
    const dir = await opendir(dirName);
    if (dir == undefined) {
        return false
    };
    const txtFileRegex = /^[^<>:"/\\|?*]+\.txt$/i;
    for await (const item of dir) {
        if (item.isDirectory()) {
            const fullDirName = dirName + "/" + item.name;
            // console.log(fullDirName)
            console.log('\t'.repeat(depth), "-", fullDirName)
            await readDirectory(fullDirName, depth + 1);
        } else {
            console.log('\t'.repeat(depth), "-", item.name);
        }
    }
    dir.close();
    return false;
}

function printSyntax() {
    console.log("1) To search for a string within file directory use the following command syntax:\n\t")
    console.log(`$ ${colors.blue} tsgrep search [directory] [searchstring] ${colors.reset} \n\t`)
    console.log("- replace [directory] with the file directory from where you want to start the search and replace [searchstring] with the string you want to search \n")
    console.log("2) To list out the files in a directory use the following command syntax:\n\t")
    console.log(`$ ${colors.blue} tsgrep read [directory] ${colors.reset}\n\t`)
    console.log("- replace [directory] with the file directory from where you want to start listing the directory and files")

}

export async function parseArguments(args: string[]): Promise<boolean> {
    if (args[0] === "search") {
        if (args[1] === undefined || args[2] === undefined) {
            console.error("Invalid syntax for search!")
            printSyntax();
            return false;
        }
        await searchTextInDirectory(args[1], args[2], 0);
        return true;

    } else if (args[0]) {
        if (args[1] == undefined) {
            console.error("Invalid syntax for read command!")
            printSyntax();
            return false;
        }
        await readDirectory(args[1], 0);
        return true;
    } else {
        printSyntax();
        return false;
    }
}