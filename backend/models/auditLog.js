class AuditLog {
    constructor(row) {
        this.audit_id = row.audit_id;
        this.user_id = row.user_id;
        this.action_type = row.action_type;
        this.entity_type = row.entity_type;
        this.entity_id = row.entity_id;
        this.created_at = row.created_at;
    }
}

module.exports = AuditLog;
