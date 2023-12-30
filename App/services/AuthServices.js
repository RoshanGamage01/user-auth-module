const {User, validate} = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * @class AuthServices
 * All the user related services are defined here. 
 * 
 * 
 * @method newUser
 */
class AuthServices{

    /**
     * @method newUser
     * Create and validate a new user or employee. 
     * 
     * @param userData 
     * @returns {Promise<{user: User}>}
     */
    async newUser(userData) {
        try{
            const {error} = validate(userData);
            if(error) throw error.details[0].message;

            const isEmailExist = await User.findOne({email: userData.email});
            if(isEmailExist) throw 'Email already exists';

            const isNICExist = await User.findOne({NIC: userData.NIC});
            if(isNICExist) throw 'NIC already exists';

            const isUsernameExist = await User.findOne({user_name: userData.user_name});
            if(isUsernameExist) throw 'Username already exists';

            const isPinExist = await User.findOne({pin: userData.pin});
            if(isPinExist) throw 'Pin already exists';

            const encryptPassword = await bcrypt.hash(userData.password, 10);
            userData.password = encryptPassword;

            const user = new User(userData);
            await user.save();
            return {user: user};
        }catch(error){
            throw error;
        }
    }
}

module.exports = new AuthServices();