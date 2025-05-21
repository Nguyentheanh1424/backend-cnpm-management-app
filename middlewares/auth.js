const Role = require('../modules/role');
const logger = require('../config/logger');

// Middleware function to validate user permissions
const validateUserPermission = (permission) => {
    return async (req, res, next) => {
        try {
            // Check for null/undefined in req.body and req.user
            if (!req.body && !req.user) {
                logger.warn('Missing request body and user information');
                return res.status(400).json({ 
                    message: "User information not provided",
                    details: "User information must be provided in the request" 
                });
            }

            // Flexibly retrieve user information from both req.body.user and req.user
            const userInfo = req.body?.user || req.user;

            if (!userInfo) {
                logger.warn('User information not provided in request');
                return res.status(400).json({ 
                    message: "User information not provided",
                    details: "User information must be provided in the request" 
                });
            }

            const userRole = userInfo.role;
            const userId = userInfo.id_owner;

            logger.info(`Checking permission '${permission}' for user with role: ${userRole}`);

            // Check if the user is Admin
            if (userRole === "Admin") {
                logger.info(`Admin user granted access to '${permission}'`);
                return next();
            }

            // Check if the role is not provided
            if (!userRole) {
                logger.warn(`Permission check failed: Role not provided`);
                return res.status(400).json({ 
                    message: "Role not provided",
                    details: "User role must be provided to check permissions" 
                });
            }

            // Check if user ID is not provided
            if (!userId) {
                logger.warn(`Permission check failed: User ID not provided`);
                return res.status(400).json({ 
                    message: "User ID not provided",
                    details: "User ID must be provided to check permissions" 
                });
            }

            logger.info(`Checking permission '${permission}' for role: ${userRole}`);

            // Query role permissions from database
            const roleData = await Role.findOne({ role: userRole, id_owner: userId });

            if (!roleData) {
                logger.warn(`Permission check failed: Role '${userRole}' not found for user ID ${userId}`);
                return res.status(404).json({ 
                    message: "Role does not exist",
                    details: `Role '${userRole}' not found for this user` 
                });
            }

            // Check if the role has this permission
            if (roleData.permissions && roleData.permissions.includes(permission)) {
                logger.info(`User with role '${userRole}' granted access to '${permission}'`);
                return next();  // If he has permission, allow access
            } else {
                logger.warn(`Permission denied: User with role '${userRole}' does not have '${permission}' permission`);
                return res.status(403).json({ 
                    message: "Access denied",
                    details: `Role '${userRole}' does not have '${permission}' permission`,
                    requiredPermission: permission
                });
            }
        } catch (err) {
            logger.error("Error in authorization middleware:", err);
            return res.status(500).json({ 
                message: "Internal server error",
                details: "An error occurred while checking user permissions" 
            });
        }
    };
};

module.exports = {
    validateUserPermission
};
