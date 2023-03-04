const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
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
        const story = collection.findOne({ _id: ObjectId(storyId) })
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

async function addStoryMsg(storyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('story')
        await collection.updateOne({ _id: ObjectId(storyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add story msg ${storyId}`, err)
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
    addStoryMsg,
    removeStoryMsg
}
