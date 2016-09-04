
var exports = module.exports = {};

exports.site = function(data) {
    var site = data.sitesResponse.site[0];

    console.log("--- Site Info ---");
    console.log(`Name: ${site.siteInfo.siteName}`);
    console.log(`ID: ${site.siteInfo.siteCode[0].attributes.network}:${site.siteInfo.siteCode[0].$value}`);
    console.log("");

    console.log("--- Catalog ---");

    site.seriesCatalog[0].series.forEach(series =>
    {
        console.log(series.variable.variableName);
        console.log(`ID: ${series.variable.variableCode[0].attributes.vocabulary}:${series.variable.variableCode[0].$value}`);
        console.log(`Data Points: ${series.valueCount}`);
        console.log(`Begins: ${series.variableTimeInterval.beginDateTime}`);
        console.log(`Ends: ${series.variableTimeInterval.endDateTime}`);
        console.log("\n");
    });
};

exports.sites = function(data) {
    data.sitesResponse.site.forEach(site =>
    {
        console.log(`--- ${site.siteInfo.siteName} ---`);
        console.log(`ID: ${site.siteInfo.siteCode[0].attributes.network}:${site.siteInfo.siteCode[0].$value}`);
        console.log("\n");
    });
};

exports.values = function(data) {
    var values = data.timeSeriesResponse.timeSeries.values;
    console.log(values);
};
