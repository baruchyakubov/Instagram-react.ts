const storyService = require('./story.service.js')
const logger = require('../../services/logger.service')
const { validateToken } = require('../auth/auth.service.js')
const utilService = require("../../services/util.service")

async function getStorys(req, res) {
  try {
    logger.debug('Getting Storys')
    const filterBy = {
      userId: req.query.userId || ''
    }
    const storys = await storyService.query(filterBy)
    res.json(storys)
  } catch (err) {
    logger.error('Failed to get storys', err)
    res.status(500).send({ err: 'Failed to get storys' })
  }
}

async function getStoryById(req, res) {
  try {
    const storyId = req.params.id
    const story = await storyService.getById(storyId)
    res.json(story)
  } catch (err) {
    logger.error('Failed to get story', err)
    res.status(500).send({ err: 'Failed to get story' })
  }
}

async function addStory(req, res) {
  try {
    const story = req.body
    console.log(story);
    const addedStory = await storyService.add(story)
    res.json(addedStory)
  } catch (err) {
    logger.error('Failed to add story', err)
    res.status(500).send({ err: 'Failed to add story' })
  }
}


async function updateStory(req, res) {
  try {
    const story = req.body
    const updatedStory = await storyService.update(story)
    res.json(updatedStory)
  } catch (err) {
    logger.error('Failed to update story', err)
    res.status(500).send({ err: 'Failed to update story' })

  }
}

async function removeStory(req, res) {
  try {
    const storyId = req.params.id
    const removedId = await storyService.remove(storyId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove story', err)
    res.status(500).send({ err: 'Failed to remove story' })
  }
}

async function changeLikeStatus(req, res) {
  try {
    let loggedinUser = validateToken(req.cookies.loginToken)
    const updatedStory = await storyService.ChangeLikeStatus(req.body.updatedStatus, req.body.story, loggedinUser)
    res.send(updatedStory)
  } catch (err) {
    logger.error('Failed to remove story', err)
    res.status(500).send({ err: 'Failed to remove story' })
  }
}

async function addStoryComment(req, res) {
  const { comment, story , loggedInUserInfo } = req.body
  try {
    const commentToAdd = {
      id: utilService.makeId(10),
      by: {
        _id: loggedInUserInfo._id,
        username: loggedInUserInfo.username,
        imgUrl: loggedInUserInfo.imgUrl
      },
      txt: comment,
      createdAt: Date.now()
    }
    let loggedinUser = await validateToken(req.cookies.loginToken)
    const savedMsg = await storyService.addStoryComment(story, commentToAdd , loggedinUser)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update story', err)
    res.status(500).send({ err: 'Failed to update story' })

  }
}

module.exports = {
  getStorys,
  getStoryById,
  addStory,
  updateStory,
  removeStory,
  addStoryComment,
  changeLikeStatus
}
