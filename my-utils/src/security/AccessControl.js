class AccessControl {
    constructor() {
        this.permissions = new Map(); // <userRole, [allowedActions]>
    }

    setPermissions(userRole, actions) {
        this.permissions.set(userRole, actions);
        console.log(`Permissions set for role: ${userRole}`);
    }

    checkPermission(user, action) {
        const allowedActions = this.permissions.get(user.role);
        if (allowedActions && allowedActions.includes(action)) {
            console.log(`Permission granted for ${action} to user ${user.username}`);
            return true;
        }
        console.log(`Permission denied for ${action} to user ${user.username}`);
        return false;
    }
}

module.exports = AccessControl;
