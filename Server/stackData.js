var fileReader = require('./fileReading');
var Stack = require('./stack');

let stack = [];

class stackData {
    constructor(path) {
        this.fR = new fileReader(path);

        this.fR.readDataFromFile(function (returnedData) {
            if (returnedData != undefined) {
                stack = returnedData;
            }
        })
    }

    addTask(task) {
        stack.addTask(task);
        stack.raiseCounter(1);
    }

    getCount() {
        return stack.getCount();
    }

    readTasks(_callback) {
        this.fR.readDataFromFile(function (returnedData) {
            if (returnedData == undefined || returnedData.length == 0) {
                returnedData = new Stack();
            }

            var nS = new Stack();
            nS.setCounter(returnedData.counter);
            for (var i = 0; i < returnedData.stack.length; i++) {
                nS.addTask(returnedData.stack[i]);
            }
            stack = nS;
            if (_callback != null) {
                _callback;
            }
        });
    }

    writeDataToFile() {
        console.log(stack);
        this.fR.writeDataToFile(stack, null);
    }
}

module.exports = stackData;