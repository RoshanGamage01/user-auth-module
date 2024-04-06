const UserRole = require("../models/UserRole");

const createRole = async (roleName) => {
  return UserRole.create({ role: roleName, status: "active" });
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  const roles = await UserRole.paginate(filter, options);
  return roles;
};

/**
 * Get role by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getRoleById = async (id) => {
  return UserRole.findById(id);
};

/**
 * Update role by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(userId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  await role.remove();
  return role;
};


module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  updateUserById,
  deleteRoleById,
};