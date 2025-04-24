class ErrorLogger {
    constructor() {
        this.logFilePath = 'logs/error.log';
        this.errorLogs = [];
    }

    logError(errorMessage) {
        const errorEntry = `[${new Date().toISOString()}] ERROR: ${errorMessage}`;
        this.errorLogs.push(errorEntry);
        console.log(errorEntry);
    }

    retrieveLogs() {
        return this.errorLogs;
    }
}

module.exports = ErrorLogger;
