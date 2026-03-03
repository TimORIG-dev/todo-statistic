const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const todoReg = /\/\/ TODO (.*)/;

const files = getFiles();
let todoLines = []
let importantLines = []
parseTODO();


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todoLines);
            break;
        case 'important':
            console.log(importantLines);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function parseTODO(){
    for (const file of files) {
        const lines = file.split(/\r?\n/);
        for (const line of lines) {
            const match = line.match(todoReg);
            if (match) {
                const comment = match[1];
                todoLines.push(comment);
                if (comment.includes('!')) {
                    importantLines.push(comment);
                }
            }
        }
    }
}
