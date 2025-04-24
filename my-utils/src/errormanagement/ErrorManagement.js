const ErrorLogger = require('./ErrorLogger');

class ErrorManagement {
    constructor() {
        this.logger = new ErrorLogger();
    }

    handleError(errorMessage) {
        console.log('Handling error...');
        this.logger.logError(errorMessage);
        // Further error handling logic can be added here
    }

    getErrorLogs() {
        return this.logger.retrieveLogs();
    }
}

module.exports = ErrorManagement;
