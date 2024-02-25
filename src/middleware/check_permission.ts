import mongoose, { Model } from "mongoose";

/**
 * Authenticate a user
 * Use cache
 * @param {Object} request
 * @param {Object} response
 * @param {Object} next
 */
const Role = mongoose.model('role') as Model<any>;
export = async (request: any, response: any, next: any) => {

    if (request.user) {
        let system_admin_roles = await Role.find({ name: "Admin" });
        let userRoles = await Role.find({ _id: request.user.role });
        userRoles = userRoles.map((x: any) => x = x.id);

        let userSystemAdminRoles = userRoles.filter((x: any) => system_admin_roles.some((y: any) => y?.id.toString() == x?.toString()));
        if (userSystemAdminRoles.length > 0) {
            return next();
        }
        let baseUrl = request.baseUrl.split('/').pop();
        const method = request.method;
        if (baseUrl == 'order' && method == 'POST') {
            return next();
        }
        // if the HTTP method is DELETE, POST, or PUT
        if (['DELETE', 'POST', 'PUT'].includes(method)) {
            // Deny access for normal users
            return response.status(403).send({ message: "Access Denied, Please contact to admin" });
        }

    }
    return response.status(403).send({ message: "Access Denied, Please contact to admin" });
}


