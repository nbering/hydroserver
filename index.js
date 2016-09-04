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
    case "--help":
        clientPromise.then(function(client){
            console.log ("Available Commands:\n");
            var prop;
            for (prop in client)
            {
                if (client.hasOwnProperty(prop) && typeof client[prop] === "function")
                    console.log(prop);
            }
        });
    case "GetSites":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(client,"WaterOneFlow", "WaterOneFlow", "GetSites", {site:{}});
            })
            .then(function(result){
                console.log(result.GetSitesResult);
                return soapWrapper.parseXml(result.GetSitesResult);
            })
            .then(function(result){
                result.sitesResponse.site.forEach(site => {
                    console.log(site.siteInfo[0].siteName[0] + ": " + JSON.stringify(site.siteInfo[0].siteCode[0]));
                });
            });
            break;

    case "GetSitesObject":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(client, "WaterOneFlow", "WaterOneFlow", "GetSitesObject", {site: {}});
            })
            .then(function(result){
                console.log(result.sitesResponse);
                result.sitesResponse.site.forEach(site =>
                {
                    console.log(`${site.siteInfo.siteName}:${JSON.stringify(site.siteInfo.siteCode)}`);
                });
            });
            break;

    case "GetSiteInfoObject":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(client, "WaterOneFlow", "WaterOneFlow", "GetSiteInfoObject", {site: input.values.site || settings.defaults.site});
            })
            .then(function(result){
                var site = result.sitesResponse.site[0];
                console.log(JSON.stringify(site, null, 4));

                console.log("--- Site Info ---");
                console.log(`Name: ${site.siteInfo.siteName}`);
                console.log(`Reference: ${site.siteInfo.siteCode[0].attributes.network}:${site.siteInfo.siteCode[0].$value}`);
                console.log("\n");

                console.log("--- Catalog ---");

                site.seriesCatalog[0].series.forEach(series =>
                {
                    console.log(series.variable.variableName);
                    console.log(`Reference: ${series.variable.variableCode[0].attributes.vocabulary}:${series.variable.variableCode[0].$value}`);
                    console.log(`Data Points: ${series.valueCount}`);
                    console.log(`Begins: ${series.variableTimeInterval.beginDateTime}`);
                    console.log(`Ends: ${series.variableTimeInterval.endDateTime}`);
                    console.log("\n");
                });
            })
            .catch(function(error){
                console.log("Error.", error);
            });
            break;
    case "GetValuesObject":
        clientPromise
            .then(function(client){
                return soapWrapper.invokeMethod(
                    client,
                    "WaterOneFlow",
                    "WaterOneFlow",
                    "GetValuesObject",
                    {
                        location: input.values.site || settings.defaults.site,
                        variable: input.values.variable || settings.defaults.variable,
                        // yyyy-mm-ddThh:mm:ss
                        startDate: input.values.startDate || settings.defaults.startDate,
                        endDate: input.values.endDate || settings.defaults.endDate
                    });
            })
            .then(function(result){
                var values = result.timeSeriesResponse.timeSeries.values;
                console.log(values);
            })
            .catch(function(error){
                console.log("Error.", error);
            });
            break;

    default:
        console.log("WTF?");
        /*
        clientPromise.then(function(client)
        {
            var serviceDescription = client.describe();
            var methods = serviceDescription["WaterOneFlow"]["WaterOneFlow"];

            if (!methods.hasOwnProperty(input.command))
                return console.error("Command is not a method on service.");

            var prop = "", args = {};
            for (prop in methods[input.command].input)
            {
                if (methods[input.command].input.hasOwnProperty(prop) && typeof methods[input.command].input[prop] === "object")
                    args[prop] = {};
            }

            var resultKey = Object.keys(methods[input.command].output)[0];

            client[input.command](args, function(error, result)
            {
                if (error)
                    return console.error("Request Error!");

                xml2js.parseString(result[resultKey], function(error, resultObj){
                    if (error)
                        return console.error("Parse Error!");

                    resultObj.sitesResponse.site.forEach(site => {
                        console.log(site.siteInfo[0].siteName[0] + ": " + JSON.stringify(site.siteInfo[0].siteCode[0]));
                    });
                });
            });
        });
        */
}
