class AuditLog {
    constructor(row) {
        this.id = row.id;
        this.userId = row.userId;
        this.action = row.action;
        this.timestamp = row.timestamp;
    }
}

module.exports = AuditLog;
