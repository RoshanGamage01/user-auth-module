const Role = require('../models/UserRole');
const RolePermissionAssign = require('../models/Permissions/RolePermissionAssign');

class RoleController {
    /**
     * Create a new role. req - {role, status}
     * 
     * @param req 
     * @param res 
     * @returns {Promise<void>} 
     */
    async createUserRole(req, res) {
        try{
            const {role, status} = req.body;
            const newRole = new Role({role, status});

            await newRole.save();
            res.status(201).json({message: 'Role created successfully'});
        }catch (_){
            res.status(500).json({message: 'Error creating role'});
        }
    }


    /**
     * Update a role.
     * request - {role, status, id}
     * response - {message} || {error}
     * 
     * @param req 
     * @param res
     * @returns {Promise<void>} 
     */
    async updateUserRole(req, res){
        try{
            const {role, status, id} = req.body;
            const roleToUpdate = await Role.findById(id);

            if(!roleToUpdate){
                res.status(404).json({message: 'Role not found'});
            }

            roleToUpdate.role = role;
            roleToUpdate.status = status;

            await roleToUpdate.save();
            res.status(200).json({message: 'Role updated successfully'});
        }catch (_){
            console.error(_);
            res.status(500).json({message: 'Error updating role'});
        }
    }


    /**
     * Get all user roles. 
     * request - {currentPageIndex, dataPerPage, filters}
     * response = {data, dataCount, currentPaginationIndex, dataPerPage, message}
     * 
     * @param req 
     * @param res 
     * @returns {Promise<void>} 
     */
    async getAllUserRoles(req, res) {
        const page = parseInt(req.body.currentPageIndex) || 1;
        const filters = req.body.filters || {};
    
        const itemsPerPage = req.body.dataPerPage;
        const skip = (page - 1) * itemsPerPage;
    
        try {
            let query = {};
        
            if (filters) {
                query = { ...filters };
        
                query.role = { $regex: filters.role || '', $options: 'i' };
            }
        
            const userRoles = await Role.find(query)
                .skip(skip)
                .limit(itemsPerPage);
        
            const totalUserRolesCount = await Role.countDocuments(query);
        
            let response = {};
        
            if (userRoles.length === 0) {
                response = {
                data: userRoles,
                dataCount: totalUserRolesCount,
                currentPaginationIndex: page,
                dataPerPage: itemsPerPage,
                message: 'There are no matching records.',
                };
            } else {
                response = {
                data: userRoles,
                dataCount: totalUserRolesCount,
                currentPaginationIndex: page,
                dataPerPage: itemsPerPage,
                message: 'Data returned',
                };
            }
        
            res.json(response);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    /**
     * Get a single role and role permissions
     * request - {id}
     * response - {data, message} || {error}
     * 
     * @param req 
     * @param res 
     * @returns {Promise<void>} 
     */
    async getUserRole(req, res){
        try{
            const {id} = req.params;
            const role = await Role.findById(id);

            if(!role){
                res.status(404).json({message: 'Role not found'});
            }

            let rolePermissions = await RolePermissionAssign.find({user_role_id: id});
            
            let response = {}

            if(rolePermissions.length === 0){
                response = {
                    role: role.role,
                    status: role.status,
                    _id: role._id,
                    permissions: [],
                }
            }else{
                response = {
                    role: role.role,
                    status: role.status,
                    _id: role._id,
                    permissions: rolePermissions[0].permission_ids,
                }
            }

            res.status(200).json({data: response, message: 'Role found'});
        }catch(_){
            res.status(500).json({message: 'Error getting role'});
        }
    }
}

module.exports = new RoleController();