module.exports = function()
{
    var args = process.argv.splice(2);

    if (!args.length)
        return {command: "--help", values:{}};

    return {command: args[0], values:{}};
}
