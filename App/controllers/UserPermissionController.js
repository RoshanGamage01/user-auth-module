const UserPermissionAssign = require('../models/Permissions/UserPermissionAssign');
const PermissionCategory = require('../models/Permissions/PermissionCategory');
const permissionGroup = require('../models/Permissions/PermissionGroup');
const Permissions = require('../models/Permissions/Permission');
const permission_checkboxes = require('../models/Permissions/PermissionCheckBoxes');

class UserPermissionController {
    /**
     * get all permissions and response it with this format
     * 
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getAllUserPermissions(req, res) {
        try{
            const permissionCategories = await PermissionCategory.find();
            const permissionGroups = await permissionGroup.find();
            const permissionCheckBoxes = await permission_checkboxes.find();
            const permissions = await Permissions.find();

            const response = {
                permission_type: [

                ]
            }

            permissionCategories.forEach((permissionCategory) => {
                response.permission_type.push({
                    permission: permissionCategory.category,
                    category_id: permissionCategory._id,
                    permission_grp: []
                })
            })

            permissionGroups.forEach((permissionGroup) => {
                response.permission_type.forEach((permissionType) => {
                    if(permissionType.category_id.equals(permissionGroup.permission_category_id)){
                        permissionType.permission_grp.push({
                            group_name: permissionGroup.group,
                            group_id: permissionGroup._id,
                            permissions: []
                        })
                    }
                })
            });

            permissions.forEach((permission) => {
                response.permission_type.forEach((permissionType) => {
                    permissionType.permission_grp.forEach((permissionGroup) => {
                        if(permissionGroup.group_id.equals(permission.permission_group_id)){
                            permissionGroup.permissions.push({
                                name: permission.permission,
                                permission_id: permission._id,
                                permissions_checkboxs: []
                            })
                        }
                    })
                })
            })

            permissionCheckBoxes.forEach((permissionCheckBox) => {
                response.permission_type.forEach((permissionType) => {
                    permissionType.permission_grp.forEach((permissionGroup) => {
                        permissionGroup.permissions.forEach((permission) => {
                            if(permission.permission_id.equals(permissionCheckBox.permissionId)){
                                permission.permissions_checkboxs.push({
                                    permission_name: permissionCheckBox.permission_name,
                                    _id: permissionCheckBox._id
                                })
                            }
                        })
                    })
                })
            })
            
            await res.json({data: [response], message: 'success'});
        }catch(error){
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /**
     * Assign new permissions to user.
     * request = {userId : string, permission_ids : Array<string>}
     * 
     * @param  req 
     * @param  res 
     * @returns {Promise<void>} 
     */
    async assignPermissionToUser(req, res) {
        try{
            const {userId, permission_ids} = req.body;
            const userPermissionAssign = await UserPermissionAssign.findOneAndUpdate({userId, permission_ids});

            if(!userPermissionAssign){
                const newUserPermissionAssign = new UserPermissionAssign({userId, permission_ids});
                await newUserPermissionAssign.save();
                return res.status(200).json({message: 'Permission assigned to user'});
            }

            res.status(200).json({message: 'Permission assigned to user'});
        }catch(e){
            res.status(500).json({message: 'Error in assignPermissionToUser'});
        }
    }

    /**
     * Update user permission assign.
     * request = {userId : string, permission_ids : Array<string>}
     * 
     * @param  req
     * @param  res
     * @returns {Promise<void>}
    */
    async updateUserParmissionAssign(req, res) {
        try{
            const permissionAssign = await UserPermissionAssign.findOneAndUpdate({_id: req.body.user_id}, {permission_ids: req.body.permission_ids}, {new: true, upsert: true});
            if(!permissionAssign){
                const newUserPermissionAssign = new UserPermissionAssign({_id: req.body.user_id, permission_ids : req.body.permission_ids});
                await newUserPermissionAssign.save();
                return res.status(200).json({message: 'Permission assigned to user'});
            }

            res.status(200).json({message: 'Permission assigned to user'});
        }catch(_){
            console.error(_);
            res.status(500).json({message: 'Error in updateUserParmissionAssign'});
        }
    }

    /**
     * Get assigned user permission by user id.
     * 
     * @param req 
     * @param res 
     * @returns {Promise<void>} 
     */
    async getUserPermissionAssignByUserId(req, res) {
        try{
            const userPermissionAssign = await UserPermissionAssign.findOne({user_id: req.params.user_id});
            if(!userPermissionAssign){
                return res.status(200).json({message: 'No permission assigned to user'});
            }

            res.status(200).json({message: 'Permission assigned to user', data: userPermissionAssign});
        }catch(_){
            console.error(_);
            res.status(500).json({message: 'Error in getUserPermissionAssignByUserId'});
        }
    }
}

module.exports = new UserPermissionController();