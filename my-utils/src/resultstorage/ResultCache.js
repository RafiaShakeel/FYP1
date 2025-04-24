class ResultCache {
    constructor() {
        this.cacheStorage = new Map(); // <query, result>
        this.cacheExpiryTime = 60000; // 1 minute expiry for simplicity
    }

    storeResult(query, result) {
        const expiryTime = Date.now() + this.cacheExpiryTime;
        this.cacheStorage.set(query, { result, expiryTime });
        console.log(`Result cached for query: ${query}`);
    }

    fetchResult(query) {
        const cachedEntry = this.cacheStorage.get(query);
        if (cachedEntry && cachedEntry.expiryTime > Date.now()) {
            console.log(`Cache hit for query: ${query}`);
            return cachedEntry.result;
        } else {
            console.log(`Cache miss for query: ${query}`);
            this.cacheStorage.delete(query);
            return null;
        }
    }
}

module.exports = ResultCache;
