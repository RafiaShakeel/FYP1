class DataSourceConnector {
    constructor() {
        this.connectionURL = 'http://example-datasource.com';
        this.connectionStatus = false;
    }

    connect() {
        this.connectionStatus = true;
        console.log(`Connected to data source at ${this.connectionURL}`);
        return this.connectionStatus;
    }

    fetchData(query) {
        if (!this.connectionStatus) {
            console.log("Error: Not connected to data source");
            return null;
        }
        console.log(`Fetching data for query: ${query}`);
        return { data: "Sample Data", query: query };
    }
}

module.exports = DataSourceConnector;
