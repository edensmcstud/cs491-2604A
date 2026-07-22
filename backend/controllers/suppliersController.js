const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Create a supplier
 */
exports.createSupplier = async (req, res) => {
    try {
        const { name, contact_email, phone } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Supplier name required" });
        }

        const result = await run(
            `INSERT INTO suppliers (name, contact_email, phone)
             VALUES (?, ?, ?)`,
            [name, contact_email, phone]
        );

        const supplierId = result.lastID;

        await logAction(req.user.user_id, "CREATE", "SUPPLIER", supplierId);

        res.json({
            message: "Supplier created",
            supplier_id: supplierId
        });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get all suppliers
 */
exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await query(`
            SELECT supplier_id, name, contact_email, phone
            FROM suppliers
            ORDER BY supplier_id ASC
        `);

        res.json(suppliers);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get a single supplier
 */
exports.getSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const rows = await query(
            `SELECT supplier_id, name, contact_email, phone
             FROM suppliers
             WHERE supplier_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Update supplier
 */
exports.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact_email, phone } = req.body;

        await run(
            `UPDATE suppliers
             SET name = ?, contact_email = ?, phone = ?
             WHERE supplier_id = ?`,
            [name, contact_email, phone, id]
        );

        await logAction(req.user.user_id, "UPDATE", "SUPPLIER", id);

        res.json({ message: "Supplier updated" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Delete supplier
 */
exports.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        await run(
            `DELETE FROM suppliers WHERE supplier_id = ?`,
            [id]
        );

        await logAction(req.user.user_id, "DELETE", "SUPPLIER", id);

        res.json({ message: "Supplier deleted" });
    } catch (err) {
        handleError(res, err);
    }
};
