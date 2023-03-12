const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const userService = require('../user/user.service')
const socketService = require("../../services/socket.service")
const { validateToken } = require('../auth/auth.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { userId: '' }) {
    try {
        const criteria = {
            'by._id': { $regex: filterBy.userId, $options: 'i' }
        }
        const collection = await dbService.getCollection('story')
        var storys = await collection.find(criteria).toArray()
        return storys
    } catch (err) {
        logger.error('cannot find storys', err)
        throw err
    }
}

async function getById(storyId) {
    try {
        const collection = await dbService.getCollection('story')
        const story = await collection.findOne({ _id: ObjectId(storyId) })
        return story
    } catch (err) {
        logger.error(`while finding story ${storyId}`, err)
        throw err
    }
}

async function remove(storyId) {
    try {
        const collection = await dbService.getCollection('story')
        await collection.deleteOne({ _id: ObjectId(storyId) })
        return storyId
    } catch (err) {
        logger.error(`cannot remove story ${storyId}`, err)
        throw err
    }
}

async function add(story) {
    try {
        const collection = await dbService.getCollection('story')
        await collection.insertOne(story)
        return story
    } catch (err) {
        logger.error('cannot insert story', err)
        throw err
    }
}

async function update(story) {
    try {
        const storyToSave = {
            vendor: story.vendor,
            price: story.price
        }
        const collection = await dbService.getCollection('story')
        await collection.updateOne({ _id: ObjectId(story._id) }, { $set: storyToSave })
        return story
    } catch (err) {
        logger.error(`cannot update story ${storyId}`, err)
        throw err
    }
}

async function ChangeLikeStatus(updatedStatus, story, loggedinUser) {
    try {
        const storyCollection = await dbService.getCollection('story')
        updatedStatus ?
            await addLike(story._id, storyCollection, loggedinUser, story) :
            await removeLike(story._id, storyCollection, loggedinUser)

        return await getById(story._id)
    } catch (err) {
        logger.error(`cannot update story ${storyId}`, err)
        throw err
    }
}

async function addLike(storyId, storyCollection, loggedinUser, story) {
    try {
        const userInfo = {
            _id: loggedinUser._id,
            fullname: loggedinUser.fullname,
            username: loggedinUser.username,
            imgUrl: loggedinUser.imgUrl
        }
        const userCollection = await dbService.getCollection('user')
        await storyCollection.updateOne({ _id: ObjectId(storyId) }, { $push: { likedBy: { $each: [userInfo], $position: 0 } } })
        const notification = { id: utilService.makeId(10), type: "like", by: userInfo, storyInfo: { _id: story._id, imgUrl: story.imgUrls[0] }, txt: 'liked your post', createdAt: Date.now() }
        await userCollection.updateOne({ _id: ObjectId(story.by._id) }, { $push: { notifications: { $each: [notification], $position: 0 } } })
        socketService.emitToUser({ type: 'send-notification', data: notification, userId: story.by._id })
    } catch (err) {
        console.log(err);
        throw err
    }
}

async function removeLike(storyId, storyCollection, loggedinUser) {
    try {
        await storyCollection.updateOne({ _id: ObjectId(storyId) }, { $pull: { likedBy: { _id: loggedinUser._id } } })
    } catch (err) {
        console.log(err);
        throw err
    }
}

async function addStoryComment(story, commentToAdd, loggedinUser) {
    try {
        const userCollection = await dbService.getCollection('user')
        const collection = await dbService.getCollection('story')
        await collection.updateOne({ _id: ObjectId(story._id) }, { $push: { comments: { $each: [commentToAdd], $position: 0 } } })
        const Story = await getById(story._id)
        if (loggedinUser._id !== story.by._id) {
            console.log(loggedinUser.username);
            const notification = {
                id: utilService.makeId(10),
                type: "comment",
                by: { _id: loggedinUser._id, fullname: loggedinUser.fullname, username: loggedinUser.username, imgUrl: loggedinUser.imgUrl },
                storyInfo: { _id: story._id, imgUrl: story.imgUrls[0] },
                txt: 'commented on your post',
                createdAt: Date.now()
            }
            await userCollection.updateOne({ _id: ObjectId(story.by._id) }, { $push: { notifications: { $each: [notification], $position: 0 } } })
            socketService.emitToUser({ type: 'send-notification', data: notification, userId: story.by._id })
        }
        socketService.broadcast({ type: 'show-comment-to-all', data: Story, userId: commentToAdd.by._id })

        return Story
    } catch (err) {
        logger.error(`cannot add story comment ${story._id}`, err)
        throw err
    }
}

async function removeStoryMsg(storyId, msgId) {
    try {
        const collection = await dbService.getCollection('story')
        await collection.updateOne({ _id: ObjectId(storyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add story msg ${storyId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addStoryComment,
    removeStoryMsg,
    ChangeLikeStatus
}
