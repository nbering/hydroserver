var soap = require("soap");
var xml2js = require("xml2js");

var exports = module.exports = {};

exports.createClient = function(url) {
    return new Promise(function(resolve, reject){
        soap.createClient(url, function(error, client){
            error ?
                reject(error) :
                resolve(client);
        });
    });
}

exports.invokeMethod = function(client, service, port, method, args)
{
    return new Promise(function(resolve, reject){
        client[method](args, function (error, result){
            error ?
                reject(error) :
                resolve(result);
        });
    });
}

exports.parseXml = function(xmlString){
    return new Promise(function(resolve, reject){
        xml2js.parseString(xmlString, function(error, result){
            error ?
                reject(error) :
                resolve(result);
        });
    });
}
