class ResultStorage {
    constructor() {
        this.storedResults = [];
    }

    storeResult(query, result) {
        this.storedResults.push({ query, result, timestamp: new Date() });
        console.log(`Result stored permanently for query: ${query}`);
    }

    getResults() {
        return this.storedResults;
    }
}

module.exports = ResultStorage;
