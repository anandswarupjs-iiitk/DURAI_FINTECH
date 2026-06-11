const notFound = (
    req,
    res,
    next
) => {

    const error = new Error(
        `Route not found: ${req.originalUrl}`
    );

    res.status(404);

    next(error);

};

// ===================================================
// GLOBAL ERROR HANDLER
// ===================================================

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    let statusCode =
        res.statusCode === 200
            ? 500
            : res.statusCode;

    let message =
        err.message ||
        "Internal Server Error";

    // ===================================================
    // INVALID MONGODB OBJECT ID
    // ===================================================

    if (
        err.name === "CastError"
    ) {

        statusCode = 400;

        message =
            `Invalid ${err.path}: ${err.value}`;

    }

    // ===================================================
    // DUPLICATE KEY ERROR
    // ===================================================

    if (
        err.code === 11000
    ) {

        statusCode = 409;

        const field =
            Object.keys(
                err.keyValue
            )[0];

        message =
            `${field
                .charAt(0)
                .toUpperCase() +
            field.slice(1)
            } already exists`;

    }

    // ===================================================
    // MONGOOSE VALIDATION ERROR
    // ===================================================

    if (
        err.name ===
        "ValidationError"
    ) {

        statusCode = 400;

        message = Object
            .values(err.errors)
            .map(
                (error) =>
                    error.message
            )
            .join(", ");

    }

    // ===================================================
    // JWT INVALID
    // ===================================================

    if (
        err.name ===
        "JsonWebTokenError"
    ) {

        statusCode = 401;

        message =
            "Invalid token";

    }

    // ===================================================
    // JWT EXPIRED
    // ===================================================

    if (
        err.name ===
        "TokenExpiredError"
    ) {

        statusCode = 401;

        message =
            "Token expired. Please login again";

    }

    // ===================================================
    // LOG ERROR
    // ===================================================

    console.error(
        "ERROR:",
        err.stack
    );

    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(
        statusCode
    ).json({

        success: false,

        message,

        stack:

            process.env.NODE_ENV ===
            "production"

                ? null

                : err.stack,

    });

};

module.exports = {

    notFound,
    errorHandler,

};