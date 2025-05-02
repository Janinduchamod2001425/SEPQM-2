export const errorHandler = (err, req, res, next) => {
    console.error("Error: ", err.message);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message || "Internal server Error",
        stack: process.env.NODE_ENV !== "production" ? null : err.status, // Hide stack in production level
    })
}