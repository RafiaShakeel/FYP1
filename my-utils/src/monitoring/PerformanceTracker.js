class PerformanceTracker {
    constructor() {
        this.performanceLogs = [];
    }

    trackQueryPerformance(query, executionTime) {
        this.performanceLogs.push({ query, executionTime });
        console.log(`Query Performance Logged: ${query} -> ${executionTime}ms`);
    }

    getPerformanceLogs() {
        return this.performanceLogs;
    }
}

module.exports = PerformanceTracker;
