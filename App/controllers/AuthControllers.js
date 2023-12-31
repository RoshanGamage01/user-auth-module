const { User } = require("../models/User");
const AuthServices = require("../services/AuthServices");
const bcrypt = require("bcrypt");
const UserPermissionAssign = require("../models/Permissions/UserPermissionAssign");
const Role = require("../models/UserRole");

class AuthController {
  async register(req, res) {
    try {
      console.log(req.body);
      const userData = req.body;
      const user = await AuthServices.newUser(userData);

      return res
        .status(200)
        .json({ message: "User successfully created." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message || error });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Email and password are required." });

      const user = await User.findOne({ email: email });
      if (!user)
        return res.status(400).json({ error: "Invalid email or password." });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(400).json({ error: "Invalid email or password." });

      const token = user.generateAuthToken();

      return res
        .status(200)
        .json({ message: "Login successful.", token: token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }

  async logout(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.userId });
      user.islogin = false;
      await user.save();
      return res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error." });
    }
  }
1
  async getAllUsers(req, res) {
    const page = parseInt(req.body.currentPageIndex) || 1;
    const filters = req.body.filters || {};

    const itemsPerPage = req.body.dataPerPage;
    const skip = (page - 1) * itemsPerPage;

    try {
      let query = {};

      if (filters) {
        query = { ...filters };

        if (filters.address === "" || !filters.address) {
          delete query.address;
        } else {
          query.address = { $regex: filters.address, $options: "i" };
        }

        query.user_name = { $regex: filters.user_name || "", $options: "i" };

        if (
          (req.body.search !== null || req.body.search !== "") &&
          req.body.search
        ) {
          query.user_name = { $regex: req.body.search || "", $options: "i" };
        }
      }

      const users = await User.find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .select("-created_at -updated_at -__v -password");

      const totalUsersCount = await User.countDocuments(query);

      let response = {};

      if (users.length === 0) {
        response = {
          data: users,
          dataCount: totalUsersCount,
          currentPaginationIndex: page,
          dataPerPage: itemsPerPage,
          message: "There are not matching records.",
        };
      } else {
        response = {
          data: users,
          dataCount: totalUsersCount,
          currentPaginationIndex: page,
          dataPerPage: itemsPerPage,
          message: "Data returned",
        };
      }

      res.json(response);
    } catch (err) {
      // console.log(err)
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getUserById(req, res) {
    const id = req.params.id; 

    try {
      const user = await User.findById(id).select("-password");

      const permissions =
        (await UserPermissionAssign.find({ user_id: id })) || null;

      let response = {};

      if (permissions.length === 0) {
        response = {
          _id: user._id,
          user_name: user.user_name,
          email: user.email,
          NIC: user.NIC,
          EMP_number: user.EMP_number,
          address: user.address,
          user_role_id: user.user_role_id,
          pin: user.pin,
          permissions: [],
        };
      } else {
        response = {
          _id: user._id,
          user_name: user.user_name,
          email: user.email,
          NIC: user.NIC,
          EMP_number: user.EMP_number,
          address: user.address,
          user_role_id: user.user_role_id,
          pin: user.pin,
          permissions: permissions[0].permission_ids || [],
        };
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user data
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    const userId = req.params.userId; // Extract userId from the URL parameter
    const updatedData = req.body; // Data to update (e.g., name, email, etc.)

    try {

      if (req.body.pin.length !== 6) return res.status(400).json({ error: 'PIN must be exactly 6 digits' });
      // Use the User model to find the user by ID and update the data
      const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the updated user data
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMe(req, res) {
    try {
      const user = await AuthServices.getUserById(req.user.userId);
      

      const userRole = await Role.findById(user.user_role_id);

      const response = {
        user_name: user.user_name,
        user_role: userRole.role
      }

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server error' });
    }
  }

  // TODO - implement role
  async mobileLogin(req, res) {
    const { pin } = req.body;

    try {
      const user = await User.findOne({ pin });

      if (!user) {
        return res.status(401).json({ message: 'Invalid PIN' });
      }

      const userPermissionAssign = await UserPermissionAssignService.getUserPermissionAssignByUserId(user._id);

      const alreadyLoging = await UserService.alreadyLoging(pin);

      if(alreadyLoging.islogin === true){
        return res.status(401).json({ message: 'You have already logged in from another device. If this was not you, please secure your account and consider changing your PIN immediately.' });
      }

      if (!userPermissionAssign || !userPermissionAssign.permission_ids.includes(Upermission.BARCODE_SCAN)) {
        return res.status(401).json({ message: 'Oops! It looks like you don\'t have the right permissions to scan in this area. Please contact your system administrator for assistance' });
      }

      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.jwtSecretKey, {
        expiresIn: '9999999999',
      });

      await User.findByIdAndUpdate(user._id, {
        "islogin": true
      }, { new: true });


      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // validate me logic
}

module.exports = new AuthController();
