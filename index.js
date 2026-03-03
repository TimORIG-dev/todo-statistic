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
        case command.startsWith('user '):
            const user = command.split(' ')[1];
            const todoByUser = getTodoByName(user);
            for (const i =0; i < todoByUser.length; i++) {
                console.log(`${i + 1} - ${todoByUser[i]}`);
            }

            console.log(`User: ${user}`);
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


function getTodoByName(name){
    const commentsByName = todoLines.filter(line => line.split(" ")[0].toLowerCase() === name.toLowerCase());

    return commentsByName;
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
