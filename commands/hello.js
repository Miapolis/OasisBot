module.exports = {
    commands: ['hello', 'hi'],
    expectedArgs: '',
    permissionError = '',
    minArgs = 0,
    permissions: [],
    requiredRoles: [],
    callback: (message, arguments, text) => {
        message.channel.send('Hello!');
    }
}