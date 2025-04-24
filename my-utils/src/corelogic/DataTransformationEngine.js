const CoreLogic = require('./CoreLogic');

class DataTransformationEngine {
    constructor() {
        this.transformedData = [];
    }

    transformData(data) {
        // Logic to transform data
        console.log("Transforming data...");
        this.transformedData.push(data);
        return data;
    }
}
module.exports = DataTransformationEngine;