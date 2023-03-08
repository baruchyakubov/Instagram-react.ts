const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const socketService = require('../../services/socket.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
    updateFollowStatus
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        if (filterBy.limit) {
            var users = await collection.find(criteria).limit(filterBy.limit).toArray()
        }
        else var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}


async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = { // needed for the returnd obj
            _id: ObjectId(user._id),
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            following: user.following,
            followers: user.followers,
            recentSearchs: user.recentSearchs,
            isFollowed: user.isFollowed,
            username: user.username,
            createdAt: user.createdAt
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function updateFollowStatus(loggedinUser, otherUser, updatedStatus) {
    otherUser._id = otherUser._id.toString()
    loggedinUser._id = loggedinUser._id.toString()
    const loggedinUserInsert = { _id: otherUser._id, fullname: otherUser.fullname, username: otherUser.username, imgUrl: otherUser.imgUrl }
    const otherUserInsert = { _id: loggedinUser._id, fullname: loggedinUser.fullname, username: loggedinUser.username, imgUrl: loggedinUser.imgUrl }
    const collection = await dbService.getCollection('user')

    try {
        (updatedStatus === 'Following') ?
            await setStatusToFollowing(loggedinUser, otherUser, collection, loggedinUserInsert, otherUserInsert) :
            await setStatusToUnfollow(loggedinUser, otherUser, collection, loggedinUserInsert, otherUserInsert)

        return getById(loggedinUser._id)
    } catch (err) {
        logger.error(`cannot update follow status`, err)
        throw err
    }
}

async function setStatusToFollowing(loggedinUser, otherUser, collection, loggedinUserInsert, otherUserInsert) {
    const notification = { id: utilService.makeId(10), by: getUserInfo(loggedinUser), txt: `${loggedinUser.username} started following you`, createdAt: Date.now() }
    await collection.updateOne({ _id: ObjectId(loggedinUser._id) }, { $push: { following: loggedinUserInsert } })
    await collection.updateOne({ _id: ObjectId(otherUser._id) }, { $push: { followers: otherUserInsert, notifications: notification } })
    socketService.emitToUser({ type: 'send-notification', data: notification, userId: otherUser._id })
}

async function setStatusToUnfollow(loggedinUser, otherUser, collection, loggedinUserInsert, otherUserInsert) {
    await collection.updateOne({ _id: ObjectId(loggedinUser._id) }, { $pull: { following: loggedinUserInsert } })
    await collection.updateOne({ _id: ObjectId(otherUser._id) }, { $pull: { followers: otherUserInsert } })
}

function getUserInfo({ _id, fullname, username, imgUrl }) {
    return {
        _id,
        fullname,
        username,
        imgUrl
    }
}

async function add({ username, password, fullname, imgUrl }) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            password,
            fullname,
            imgUrl,
            following: [],
            followers: [],
            recentSearchs: [],
            isFollowed: false,
            username,
            createdAt: Date.now()
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    return criteria
}




