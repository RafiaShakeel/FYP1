class CoreLogic {
    constructor() {
        this.processedData = [];
    }

    processData(data) {
        // Logic to process data
        console.log("Processing data...");
        this.processedData.push(data);
    }
}
module.exports = CoreLogic;
