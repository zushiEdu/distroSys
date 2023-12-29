class stack {
    constructor() {
        this.counter = 0;
        this.stack = [];
    }

    addTask(task) {
        this.stack.push(task);
    }

    getCount() {
        return this.counter;
    }

    raiseCounter(a) {
        this.counter += a;
    }

    setCounter(amt) {
        this.counter = amt;
    }

    setStack(stack) {
        this.stack = stack;
    }
}

module.exports = stack;