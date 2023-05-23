const express = require('express')
const router = express.Router()

const userController = require('../controller/user')

const isAuth = require('../middleware/isAuth')

router.get('', isAuth, userController.getUsers)

router.get('/:id', userController.getOneUser)

router.post('/signup', userController.createUser)

router.post('/signin', userController.signIn)

module.exports = router