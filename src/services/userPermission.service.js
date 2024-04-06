const UserPermissionAssign = require('../models/Permissions/UserPermissionAssign');
const PermissionCategory = require('../models/Permissions//PermissionCategory');
const permissionGroup = require('../models/Permissions/PermissionGroup');
const Permissions = require('../models/Permissions/Permission');
const permission_checkboxes = require('../models/Permissions/PermissionCheckBoxes');
const ApiError = require("../utils/ApiError");

const getAllUserPermissions = async () => {
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
        
        return response;
    }catch(error){
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
}

const assignPermissionToUser = async (userId, permission_ids) => {
    try{
        const userPermissionAssign = await UserPermissionAssign.findOneAndUpdate({user_id: userId}, {permissions: permission_ids}, {new: true, upsert: true});

        if(!userPermissionAssign){
            const newUserPermissionAssign = new UserPermissionAssign({userId, permission_ids});
            await newUserPermissionAssign.save();
            return 'Permission assigned successfully';
        }

        return 'Permission assigned to user';
    }catch(error){
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
}

const getUserPermissionAssignByUserId = async (userId) => {
    const userPermissionAssign = await UserPermissionAssign.findOne({user_id: userId});

    if(!userPermissionAssign){
        throw new ApiError(httpStatus.NOT_FOUND, 'User permission not found');
    }

    return userPermissionAssign;
}

module.exports = {
    getAllUserPermissions,
    assignPermissionToUser,
    getUserPermissionAssignByUserId
}