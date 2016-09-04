module.exports = function()
{
    var args = process.argv.splice(2);

    if (!args.length)
        return {command: "help", values:{}};

    var command = args.shift();

    var values = {};

    while(args.length)
    {
        var thisArg = args.shift();
        switch(thisArg)
        {
            case "--start-date":
            case "-s":
                values.startDate = args.shift();
                break;
            case "--end-date":
            case "-e":
                values.endDate = args.shift();
                break;
            case "--site":
            case "-l":
                values.site = args.shift();
                break;
            case "--variable":
            case "-v":
                values.variable = args.shift();
                break;
            case "--service":
            case "-S":
                values.service = args.shift();
                break;
            case "--port":
            case "-p":
                values.port = args.shift();
                break;
            default:
                throw `Error parsing parameters at: "${thisArg}".`;
        }
    }

    return {command: command, values: values};
}
