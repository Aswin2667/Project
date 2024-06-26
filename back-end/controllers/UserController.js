const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../helpers/Mail');
const JWT_SECRET_KEY = "123456789";
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, phonenumber } = req.body;
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
                password: hashPassword,
                phonenumber
            }
        );
        delete user.password;
        const emailSubject = 'Registration Confirmation for Bike Care';
        const emailText = `Thank you for registering on our website, ${username}!\n\nWe have added you to our Bike Care program.\n\nPlease do not reply to this email; it is an automated message.`;
        const emailHtml = `<p>Dear ${username},</p><p>Thank you for registering on our website!</p><p>We have added you to our Bike Care program.</p><p>Please do not reply to this email; it is an automated message.</p>`;

        sendEmail(email, emailSubject, emailText, emailHtml, (error, response) => {
            if (error) {
                console.error('Error sending registration email:', error);
            } else {
                console.log('Registration email sent successfully to :', username);
            }
        });
        return res.json({ status: true, user });
    } catch (error) {
        next(error)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json(
                {
                    msg: "Incorrect Username or Password",
                    status: false
                }
            )
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json(
                {
                    msg: "Incorrect Username or Password",
                    status: false
                }
            )
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
            expiresIn: "2hr"
        });
        delete user.password;
        return res.json({ status: true, token });
    } catch (error) {
        next(error)
    }
}
module.exports.verifytoken = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
        return res.status(404).json({ message: "No token found" });
    }
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(400).json({ message: " Token Expired" });
        }
        req.id = user.id;
    });
    next();
}
module.exports.getUser = async (req, res, next) => {
    const userID = req.id;
    let user;
    try {
        user = await User.findById(userID, "-password");
    } catch (error) {
        return new Error(error);
    }
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ user });
}
module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarimage = req.body.avatarimage;
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarimage
            }
        );
        return res.json({
            msg: "Profile Set Successfully",
            status: true
        })
    } catch (err) {
        next(err)
    }
}
module.exports.getAllUser = async (req, res, next) => {
    try {
        const userData = await User.find({ role: "CLIENT" });
        return res.json(userData);
    } catch (err) {
        next(err)
    }
}

