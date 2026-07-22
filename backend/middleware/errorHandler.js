module.exports = (err, req, res, next) => {
    // Always log the full error for debugging
    console.error("ERROR:", err);

    // Normalize error object
    const status = typeof err.status === "number" ? err.status : 500;
    const message = err.message || "Internal server error";

    // Send safe JSON response
    res.status(status).json({
        error: message
    });
};
