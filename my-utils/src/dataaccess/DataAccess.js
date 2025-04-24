const DataSourceConnector = require('./DataSourceConnector');

class DataAccess {
    constructor() {
        this.connector = new DataSourceConnector();
    }

    fetchData(query) {
        if (!this.connector.connectionStatus) {
            console.log("Connecting to data source...");
            this.connector.connect();
        }
        return this.connector.fetchData(query);
    }
}

module.exports = DataAccess;
