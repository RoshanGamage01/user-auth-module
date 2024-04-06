const allRoles = {
  user: ['getConplaint', 'addComplaint', 'manageComplaint'],
  admin: ['getUsers', 'manageUsers', 'getConplaint', 'addComplaint', 'manageComplaint'],

};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
