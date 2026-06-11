const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===================================================
// PROTECT ROUTES
// ===================================================

const protect = async (req, res, next) => {

    try {

        let token;

        // ===================================================
        // GET TOKEN FROM AUTH HEADER
        // ===================================================

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {

            token =
                req.headers.authorization.split(" ")[1];

        }

        // ===================================================
        // NO TOKEN
        // ===================================================

        if (!token) {

            return res.status(401).json({

                success: false,
                message: "Not authorized. No token provided",

            });

        }

        // ===================================================
        // VERIFY TOKEN
        // ===================================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ===================================================
        // FIND USER
        // ===================================================

        const user = await User.findById(
            decoded.id
        ).select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "User no longer exists",

            });

        }

        // ===================================================
        // ACCOUNT ACTIVE CHECK
        // ===================================================

        if (
            user.isActive !== undefined &&
            user.isActive === false
        ) {

            return res.status(401).json({

                success: false,
                message: "Account is deactivated",

            });

        }

        // ===================================================
        // ATTACH USER TO REQUEST
        // ===================================================

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "AUTH MIDDLEWARE ERROR:",
            error.message
        );

        // ===================================================
        // TOKEN EXPIRED
        // ===================================================

        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,
                message:
                    "Token expired. Please login again",

            });

        }

        // ===================================================
        // INVALID TOKEN
        // ===================================================

        return res.status(401).json({

            success: false,
            message:
                "Invalid token. Authentication failed",

        });

    }

};

// ===================================================
// ADMIN ONLY ACCESS
// ===================================================

const adminOnly = async (
    req,
    res,
    next
) => {

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,
                message: "Authentication required",

            });

        }

        if (
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "Admin access required",

            });

        }

        next();

    } catch (error) {

        return res.status(500).json({

            success: false,
            message:
                "Authorization check failed",

        });

    }

};

// ===================================================
// OPTIONAL ROLE CHECK
// ===================================================

const authorize = (...roles) => {

    return (
        req,
        res,
        next
    ) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,
                message:
                    "Authentication required",

            });

        }

        if (
            !roles.includes(
                req.user.role
            )
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "Access denied",

            });

        }

        next();

    };

};

// ===================================================
// EXPORTS
// ===================================================

module.exports = {

    protect,
    adminOnly,
    authorize,

};