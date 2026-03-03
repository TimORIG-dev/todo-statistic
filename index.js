const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const todoReg = /\/\/ TODO (.*)/;
const parse = /(?:(.*); )?(?:(\d\d\d\d-\d\d-\d\d);)(.*)/

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
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'user':
            const user = command.split(' ')[1].split(';')[0];
            const todoByUser = getTodoByName(user);
            for (let i =0; i < todoByUser.length; i++) {
                console.log(`${i + 1} - ${todoByUser[i]}`);
            }
            break;
        case 'show':
            console.log(todoLines);
            break;
        case 'important':
            console.log(importantLines);
            break;

        case 'sort':
            const sortBy = command.split(' ')[1];
            if (sortBy === 'importance') {
                const sortedByImportance = todoLines.sort((a, b) => {
                    const aImportance = (a.match(/!/g) || []).length;
                    const bImportance = (b.match(/!/g) || []).length;
                    return bImportance - aImportance;
                }
                );
                console.log(sortedByImportance);
            } else if (sortBy === 'user') { 
                const sortedByUser = todoLines.sort((a, b) => {
                    const aUser = a.split(';')[0].toLowerCase();
                    const bUser = b.split(';')[0].toLowerCase();
                    if (a.includes(';') && !b.includes(';')) {
                        return -1;
                    }
                    if (!a.includes(';') && b.includes(';')) {
                        return 1;
                    }
                    if (aUser < bUser) return -1;
                    if (aUser > bUser) return 1;
                    return 0;
                }
                );
                console.log(sortedByUser);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}


function getTodoByName(name){
    const commentsByName = todoLines.filter(line => line.toLowerCase().startsWith(name.toLowerCase()));

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
