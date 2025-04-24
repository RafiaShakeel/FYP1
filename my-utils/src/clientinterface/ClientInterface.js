class ClientInterface {
    constructor(userQueryInterface) {
        this.userQueryInterface = userQueryInterface; // Relation to UserQueryInterface
    }

    displayResults(results) {
        console.log('Displaying Results:', results);
    }

    handleUserInput(queryText) {
        return this.userQueryInterface.processUserQuery(queryText);
    }
}
module.exports = ClientInterface;