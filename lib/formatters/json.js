
var exports = module.exports = {};

exports.site = function(data) {
    var site = data.sitesResponse.site[0];
    var siteInfo = site.siteInfo;
    var siteCode = site.siteInfo.siteCode[0];
    var catalog = site.seriesCatalog[0].series;
    var out = {};

    out.name = siteInfo.siteName;
    out.ID = `${siteCode.attributes.network}:${siteCode.$value}`;
    out.series = catalog.map(series =>
    {
        var variableCode = series.variable.variableCode[0];
        return {
            name: series.variable.variableName,
            ID: `${variableCode.attributes.vocabulary}:${variableCode.$value}`,
            valueCount: series.valueCount,
            begins: series.beginDateTime,
            ends: series.endDateTime
        };
    });

    console.log(JSON.stringify(out, null, 2));
};

exports.sites = function(data) {
    var sites = data.sitesResponse.site;

    var out = {};

    out.sites = sites.map(site =>
    {
        var ret = {};
        var siteCode = site.siteInfo.siteCode[0];
        ret.name = site.siteInfo.siteName;
        ret.ID = `${siteCode.attributes.network}:${siteCode.$value}`;

        return ret;
    });

    console.log(JSON.stringify(out, null, 2));
};

exports.values = function(data) {
    var out = {};

    var timeSeries = data.timeSeriesResponse.timeSeries;
    var values = timeSeries.values;
    var noDataValue = timeSeries.variable.NoDataValue;

    out.unit = values.attributes.unitsAbbreviation;
    out.unitType = values.attributes.unitsType;

    out.values = values.value.map(val =>
    {
        var outVal = val.$value;

        if (outVal === noDataValue)
            outVal = null;
        else if (!isNaN(outVal))
            outVal = +outVal;

        return {
            value: outVal,
            dateTime: val.attributes.dateTime
        };
    });

    console.log(JSON.stringify(out, null, 2));
};
