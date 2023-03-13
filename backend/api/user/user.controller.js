const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')
const { validateToken } = require('../auth/auth.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            limit: +req.query?.limit || null
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        logger.info('updating user')
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function changeSavedStatus(req, res) {
    try {
        const { updatedStatus , story } = req.body
        const loggedInUserId = req.params.id
        await userService.changeSavedStatus(updatedStatus , story , loggedInUserId)
        logger.info('updating save status')
        res.send({ msg: 'save status updated successfully' })
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function updateFollowStatus(req, res) {
    try {
        let loggedinUser = validateToken(req.cookies.loginToken)
        loggedinUser = await userService.getById(loggedinUser._id)
        const otherUser = await userService.getById(req.params.id)
        const user = await userService.updateFollowStatus(loggedinUser , otherUser , req.body.updatedStatus)
        logger.info('updating follow status')
        res.send(user)
    } catch (err) {
        logger.error('Failed to update follow status', err)
        res.status(500).send({ err: 'Failed to update follow status' })
    }
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    updateFollowStatus,
    changeSavedStatus
}