module.exports = (res, err) => {
    console.error("ERROR:", err);

    const status =
        (err && typeof err === "object" && typeof err.status === "number")
            ? err.status
            : 500;

    const message =
        (err && typeof err === "object" && typeof err.message === "string")
            ? err.message
            : String(err || "Internal server error");

    if (!res || typeof res.status !== "function") {
        console.error("FATAL: res is undefined in error handler");
        return;
    }

    res.status(status).json({ error: message });
};
