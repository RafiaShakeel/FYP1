class UserQueryInterface {
    constructor(queryProcessor) {
        this.queryProcessor = queryProcessor; // Relation to QueryProcessor
    }

    processUserQuery(queryText) {
        if (!queryText) {
            throw new Error('Query text cannot be empty');
        }
        return this.queryProcessor.executeQuery(queryText);
    }
}
module.exports = UserQueryInterface;