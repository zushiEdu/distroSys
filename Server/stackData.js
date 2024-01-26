var fileReader = require('./fileReading');
var Stack = require('./stack');

let stack;

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
        stack.getCount()
        stack.addTask(task);
    }

    getCount() {
        return stack.getCount();
    }

    readTasks(_callback) {
        this.fR.readDataFromFile(function (returnedData) {
            stack = new Stack(returnedData.counter, returnedData.stack);
        });
    }

    writeDataToFile() {
        console.log(stack);
        this.fR.writeDataToFile(stack, null);
    }
}

module.exports = stackData;