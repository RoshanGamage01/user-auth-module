const { User } = require('../models/User');
const AuthServices = require('../services/AuthServices');
const bcrypt = require('bcrypt');

class AuthController {
    async register(req, res) {
        try{
            console.log(req.body);
            const userData = req.body;
            const user = await AuthServices.newUser(userData);

            return res.status(200).json({user: user, message: 'User successfully created.'});
        }catch(error){
            console.log(error)
            return res.status(400).json({error: error.message || error});
        }
    }
    async login(req, res) {
        try{
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({error: 'Email and password are required.'});

            const user = await User.findOne({email: email});
            if(!user) return res.status(400).json({error: 'Invalid email or password.'});

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) return res.status(400).json({error: 'Invalid email or password.'});

            const token = user.generateAuthToken();

            return res.status(200).json({message: 'Login successful.', token: token});
        }catch(error){
            console.log(error);
            return res.status(500).json({error: "Internal Server Error."});
        }
    }
    async logout(req, res) {
        try{
            const user = await User.findOne({_id: req.user.userId});
            user.islogin = false;
            await user.save();
            return res.status(200).json({message: 'Logout successful.'});
        }catch(error){
            
            return res.status(500).json({error: "Internal Server Error."});
        }
    }
}

module.exports = new AuthController();