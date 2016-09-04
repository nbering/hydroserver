#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var soapWrapper = require("./lib/soap-wrapper");
var processArgs = require("./lib/process-args");
var xml2js = require("xml2js");

var input = processArgs();


/* Parse Settings File */
var settingsText = fs.readFileSync(path.resolve(__dirname, "./settings.json"));
var settings;

try {
    settings = JSON.parse(settingsText);
}
catch (e)
{
    console.error("Failed to parse settings file.");
    process.exit(1);
}

var clientPromise = soapWrapper.createClient(settings.wsdl);

switch (input.command)
{
    case "sites":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(
                    client,
                    input.values.service || settings.defaults.service,
                    input.values.port || settings.defaults.port,
                    "GetSitesObject",
                    {
                        site: {}
                    });
            })
            .then(input.formatter.sites);
            break;

    case "site":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(
                    client,
                    input.values.service || settings.defaults.service,
                    input.values.port || settings.defaults.port,
                     "GetSiteInfoObject",
                     {
                         site: input.values.site || settings.defaults.site
                     });
            })
            .then(input.formatter.site)
            .catch(function(error){
                console.log("Error.", error);
            });
            break;
    case "values":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(
                    client,
                    input.values.service || settings.defaults.service,
                    input.values.port || settings.defaults.port,
                    "GetValuesObject",
                    {
                        location: input.values.site || settings.defaults.site,
                        variable: input.values.variable || settings.defaults.variable,
                        // yyyy-mm-ddThh:mm:ss
                        startDate: input.values.startDate || settings.defaults.startDate,
                        endDate: input.values.endDate || settings.defaults.endDate
                    });
            })
            .then(input.formatter.values)
            .catch(function(error){
                console.log("Error.", error);
            });
            break;

    case "help":
    default:
        console.log("usage: hydroserver [command] [options]");
        console.log("");
        console.log("commands:");
        console.log("  help");
        console.log("  site");
        console.log("  sites");
        console.log("  values");
        console.log("options:");
        console.log("  --site, -l");
        console.log("    Site ID. Example: NPCA:BALLS_FALLS");
        console.log("  --start-date, -s");
        console.log("    Start date when fetching values. Format: yyyy-mm-ddThh:mm:ss");
        console.log("    Example: 2016-08-02T13:00:00");
        console.log("  --end-date, -e");
        console.log("    End date when fetching values. Same as above.");
        console.log("  --variable, -v");
        console.log("    Data series to fetch. Example: NPCA:FLOW");
        console.log("  --service, -S");
        console.log("    Service name from WSDL to use. Advanced option.");
        console.log("  --port, -p");
        console.log("    Port name from WSDL to use. Advanced option.");
        console.log("");
}
