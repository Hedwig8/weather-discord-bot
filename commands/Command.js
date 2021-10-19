const {add, remove} = require('./Add');
const current = require('./Current');

const commands = {
    add,
    current,
    remove,
}

module.exports = (message) => {
    let tokens = message.content.split(' ');
    let command = tokens.shift();

    if (command.charAt(0) == '.') {
        command = command.substr(1);
        let action = commands[command];
        if (action != null) {
            action(message, tokens);
        }
    }
};