const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
        return res.json(
            {
                msg: "Username aldready exists",
                status: false
            }
        )
    }
    const mailCheck = await User.findOne({ email });
    if (mailCheck) {
        return res.json(
            {
                msg: "email aldready exists",
                status: false
            }
        )
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
        {
            username,
            email,
            password: hashPassword
        }
    );
    delete user.password;
    console.log("New User Registerd : "+user.username);
    return res.json({status:true,user});
    } catch (error) {
        next(error)
    }
    console.log(req.body);
}