class AuditLog {
    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;     // FIXED
        this.action = row.action;
        this.timestamp = row.timestamp;
    }
}

module.exports = AuditLog;
