const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res, next) => {

    const name = req.body.name;
    const phone = req.body.phone;
    const age = req.body.age;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPass = await bcrypt.hash(password, 12)

        const user = await new User({
            name: name,
            phone: phone,
            age: age,
            email: email,
            password: hashedPass
        })

        const createdUser = await user.save()

        return res.status(200).json({ message: 'User created Successfully', user: createdUser })
    } catch (err) {
        console.log(err);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const getAllUsers = await User.find()
        if (!getAllUsers) {
            return new Error('Users Not Found')
        }
        return res.status(200).json({ message: "Fetched All Messages", getAllUsers })
    } catch (err) {
        console.log(err);
    }
}

exports.signIn = async (req, res, next) => {
    try {
        let loadedUser
        const email = req.body.email;
        const password = req.body.password;

        console.log(email);
        console.log(password);

        const existingUser = await User.findOne({ email: email })

        loadedUser = existingUser

        if (!existingUser) {
            return new Error('User Not Found')
        }

        const hashedPass = await bcrypt.compare(password, existingUser.password)

        console.log(hashedPass);

        if (!hashedPass) {
            return new Error('Password Error')
        }

        const token = await jwt.sign({ email: loadedUser.email, userId: loadedUser._id, name: loadedUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' })
        if (!token) {
            return new Error('Token Not Generated')
        }

        console.log(token);

        return res.status(200).json({ message: "Logged In Successfully", token: token, name: loadedUser.name, email: loadedUser.email })
    } catch (err) {
        console.log(err);
    }
}

exports.getOneUser = async (req, res, next) => {
    try {
        const userId = req.params.id

        const existingUser = await User.findById(userId)

        if (!existingUser) {
            return new Error('User Not Found')
        }

        return res.status(200).json({ message: "User Fetched Succesfully", user: existingUser })
    } catch (err) {
        console.log(err);
    }
}