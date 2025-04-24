class ExternalDataSources {
    constructor() {
        this.sources = [];
    }

    addSource(sourceName, connectionDetails) {
        this.sources.push({ sourceName, connectionDetails });
        console.log(`Source ${sourceName} added.`);
    }

    getSources() {
        return this.sources;
    }
}

module.exports = ExternalDataSources;
