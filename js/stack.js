var Stack = function() {
    this.values = [MATHS.getI4()]; // The stack is initiated with the identity
    this.add = function(data) {
        this.values.push(data); // New matrix in stack
    }

    this.evaluate = function() {
        var result = this.values[this.values.length - 1];
        for (var i = this.values.length - 2; i >= 0; i--) {
            result = MATHS.mul(result, this.values[i]); // Items are removed from the stack by multiplying by the output
        }
        return result;
    }

    this.copy = function(otherStack) {
        for (var i = 1; i < otherStack.values.length; i++) { // All values ​​are covered, except the first, which is always the identity
            this.values.push(otherStack.values[i]); // The values ​​of the other stack are included in the stack
        }
    }
}