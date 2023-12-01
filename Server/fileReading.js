var fs = require('fs');

class fileReader {
    constructor(path) {
        this.path = path;
    }

    readDataFromFile(_callback) {
        fs.readFile(this.path, 'utf8', function (err, returnedData) {
            if (returnedData == undefined || returnedData == "" || returnedData == null) {
                returnedData = "[]";
            }
            _callback(JSON.parse(returnedData));

            if (err != null) {
                console.error(err);
            }
        });
    }

    writeDataToFile(data, _callback) {
        fs.writeFile(this.path, JSON.stringify(data, null, 4), 'utf8', function (err, returnedData) {
            if (_callback != null) {
                _callback(returnedData);
            }
            if (err != null) {
                console.error(err);
            }
        });
    }
}

module.exports = fileReader;