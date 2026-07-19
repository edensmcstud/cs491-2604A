class Employee {
    constructor(row) {
        this.id = row.id;
        this.username = row.username;
        this.passwordHash = row.passwordHash;
        this.roleId = row.roleId;
        this.active = row.active;
    }
}

module.exports = Employee;
