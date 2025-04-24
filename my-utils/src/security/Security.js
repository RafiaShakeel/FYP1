const AccessControl = require('./AccessControl');
const EncryptionHandler = require('./EncryptionHandler');

class Security {
    constructor() {
        this.accessControl = new AccessControl();
        this.encryptionHandler = new EncryptionHandler();
    }

    setRolePermissions(role, actions) {
        this.accessControl.setPermissions(role, actions);
    }

    checkUserPermission(user, action) {
        return this.accessControl.checkPermission(user, action);
    }

    encryptData(data) {
        return this.encryptionHandler.encrypt(data);
    }

    decryptData(encryptedData, iv) {
        return this.encryptionHandler.decrypt(encryptedData, iv);
    }
}

module.exports = Security;
