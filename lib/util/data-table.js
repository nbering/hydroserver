module.exports = DataTable;

var validColumnTypes = [
    "string",
    "number",
    "boolean",
    "date",
    "datetime",
    "timeofday"
]

function DataTable() {
    this._columnCount = 0;
    this._columns = [];

}

DataTable.prototype.addColumn = function(type, label, id) {
    var role = null;
    var pattern = null;

    if (typeof type === "object"){
        label = type.label;
        id = type.id;
        role = type.role;
        pattern = type.pattern;
        type = type.type;
    }

    var col = {};

    if (type)
    {
        if (validColumnTypes.indexOf(type) < 0)
            throw new Error("TypeError: Invalid column type identifier.");

        col.type = type;
    }

    if (label)
        col.label = label;

    if (id)
        col.id = id;

    this._columns.push(col);

    this._rows.forEach(r =>
    {
        r.c.push({v:null});
    });

    return this._columns.indexOf(col);
}

DataTable.prototype.addRow = function(cellArray) {
    cellArray = cellArray | [];

    var i;
    var newRow = {c: []};
    for (i = 0; i < this._columns.length)
    {
        if (cellArray.length <= i || cellArray[i] === null || cellArray[i] === undefined)
            return newRow.c.push({v: null});

        if (typeof cellArray[i] === "object"){
            if (!("v" in cellArray[i]))
                throw new Error("TypeError: Invlid object passed as cell value.");

            return newRow.c.push(cellArray[i]);
        }

        newRow.c.push({v: cellArray[i]});
    }
    this._rows.push(newRow);
    return this._rows.indexOf(newRow);
}

DataTable.prototype.addRows = function(numOrArray){
    if (typeof numOrArray === "number")
        numOrArray = new Array(numOrArray);

    var lastIndex;
    numOrArray.forEach(arr =>
    {
        lastIndex = this.addRow(arr);
    });

    return lastIndex;
}

DataTable.prototype.getColumnId = function(columnIndex)
{
    if (columnIndex >= this._columns.length)
        throw new Error("RangeError: Column index out of set bounds.");

    var id = this._columns[columnIndex].id;

    if (id === undefined)
        return null;

    return id;
}

DataTable.prototype.getColumnLabel = function(columnIndex)
{
    if (columnIndex >= this._columns.length)
        throw new Error("RangeError: Column index out of set bounds.");

    var label = this._columns[columnIndex].label;

    if (label === undefined)
        return null;

    return label;
}

DataTable.prototype.getColumnPattern = function(columnIndex)
{
    if (columnIndex >= this._columns.length)
        throw new Error("RangeError: Column index out of set bounds.");

    var pattern = this._columns[columnIndex].pattern;

    if (pattern === undefined)
        return null;

    return pattern;
}

DataTable.prototype.getColumnProperties = function(columnIndex)
{
    if (columnIndex >= this._columns.length)
        throw new Error("RangeError: Column index out of set bounds.");

    return this._columns[columnIndex];
}

DataTable.prototype.getColumnProperty = function(columnIndex, name)
{
    if (columnIndex >= this._columns.length)
        throw new Error("RangeError: Column index out of set bounds.");

    if (name in this._columns[columnIndex] && this._columns[columnIndex].hasOwnProperty(name))
        return this._columns[columnIndex][name];

    return null;
}

DataTable.prototype.getColumnRange = throwNotImplemented;
DataTable.prototype.getColumnRole = throwNotImplemented;
DataTable.prototype.getColumnType = throwNotImplemented;
DataTable.prototype.getDistinctValues = throwNotImplemented;
DataTable.prototype.getFilteredRows = throwNotImplemented;
DataTable.prototype.getFormattedValue = throwNotImplemented;

DataTable.prototype.getNumberOfColumns = function()
{
    return this._columns.length;
}

DataTable.prototype.getNumberOfRows = function()
{
    return this._rows.length;
}

DataTable.prototype.getProperties = function(rowIndex, columnIndex)
{
    throw new Error("Not implemented.");
}

DataTable.prototype.getProperty = function(rowIndex, columnIndex, name)
{
    throw new Error("Not implemented");
}

DataTable.prototype.getRowProperties = function(rowIndex)
{
    throw new Error("Not implemented.");
}

DataTable.prototype.getRowProperty = function(rowIndex, name)
{
    throw new Error("Not implemented");
}

DataTable.prototype.getSortedRows = function(sortColumns)
{
    throw new Error("Not implemented");
}

DataTable.prototype.getTableProperties = function()
{
    throw new Error("Not implemented.");
}

DataTable.prototype.getValue = function(rowIndex, columnIndex)
{
    return this._rows[rowIndex].c[columnIndex].v;
}

DataTable.prototype.insertColumn = function(columnIndex, type, label, id)
{
    throw new Error("Not implemented.");
}

DataTable.prototype.insertRows = function(rowIndex, numberOrArray)
{
    throw new Error("Not implemented.");
}

DataTable.prototype.removeColumn = function(columnIndex)
{
    throw new Error("Not impemented.");
}

DataTable.prototype.removeColumns = function(columnIndex, numberOfColumns)
{
    throw new Error("Not impemented.");
}

DataTable.prototype.removeRow = function(rowIndex)
{
    throw new Error("Not impemented.");
}

DataTable.prototype.removeRows = function(rowIndex, numberOfRows)
{
    throw new Error("Not impemented.");
}

DataTable.prototype.setCell = function(rowIndex, columnIndex, value, formattedValue, properties){
    var cell = this._rows[rowIndex].c[columnIndex];

    cell.v = value;

    if (formattedValue !== undefined)
        cell.f = formattedValue;

    if (properties !== undefined)
        cell.p = properties;
}

DataTable.prototype.setColumnLabel = function(columnIndex, label) {
    this._columns[columnIndex].label = label;
}

DataTable.prototype.setColumnProperty = function(columnIndex, name, value)
{
    this._columns[columnIndex].p[name] = value;
}

DataTable.prototype.setFormattedValue(rowIndex, columnIndex, formattedValue){
    this._rows[rowIndex].c[columnIndex].f = formattedValue;
}

DataTable.prototype.setProperty = function(rowIndex, columnIndex, name, value)
{
    this._rows[rowIndex].c[columnIndex].p = this._rows[rowIndex].c[columnIndex].p || {};
    this._rows[rowIndex].c[columnIndex].p[name] = value;
}

DataTable.prototype.setProperty = function(rowIndex, columnIndex, properties)
{
    this._rows[rowIndex].c[columnIndex].p = properties;
}

function throwNotImplemented(){
    throw new Error("Not Implemented.");
}
