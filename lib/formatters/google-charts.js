
var exports = module.exports = {};

exports.site = function(data) {
    throw "Formatter not implemented.";
};

exports.sites = function(data) {
    throw "Formatter not implemented.";
};

exports.values = function(data) {
    var out = {};

    var timeSeries = data.timeSeriesResponse.timeSeries;
    var values = timeSeries.values;
    var noDataValue = timeSeries.variable.NoDataValue;

    var dt = {};
    dt.cols = [];
    dt.cols.push({label: "Date/Time", type: "datetime"});
    dt.cols.push({label: timeSeries.variable.variableName, type: "number" });

    out.unit = values.attributes.unitsAbbreviation;
    out.unitType = values.attributes.unitsType;

    dt.rows = values.value.map(val =>
    {
        var outVal = val.$value;

        if (outVal === noDataValue)
            outVal = null;
        else if (!isNaN(outVal))
            outVal = +outVal;

        return {c:[
            {v: formatDate(val.attributes.dateTime)},
            {v: outVal}
        ]};
    });

    console.log(JSON.stringify(dt));
};

function formatDate(dateString)
{
    var re = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    var m;

    if ((m=re.exec(dateString)) !== null) {
        if (m.index === re.lastIndex){
            re.lastIndex ++;
        }

        return `Date(${m[1]},${(+m[2])-1},${m[3]},${m[4]},${m[5]},${m[6]})`;
    }


};
