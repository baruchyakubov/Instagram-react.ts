const storyService = require('./story.service.js')

const logger = require('../../services/logger.service')
const { validateToken } = require('../auth/auth.service.js')

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
  const { loggedinUser } = req

  try {
    const story = req.body
    story.owner = loggedinUser
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
    const storyId = req.params.id
    let loggedinUser = validateToken(req.cookies.loginToken)
    const userNstoryData = await storyService.ChangeLikeStatus(req.body.updatedStatus, storyId, loggedinUser)
    res.send(userNstoryData)
  } catch (err) {
    logger.error('Failed to remove story', err)
    res.status(500).send({ err: 'Failed to remove story' })
  }
}

async function addStoryMsg(req, res) {
  const { loggedinUser } = req
  try {
    const storyId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await storyService.addStoryMsg(storyId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update story', err)
    res.status(500).send({ err: 'Failed to update story' })

  }
}

async function removeStoryMsg(req, res) {
  const { loggedinUser } = req
  try {
    const storyId = req.params.id
    const { msgId } = req.params

    const removedId = await storyService.removeStoryMsg(storyId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove story msg', err)
    res.status(500).send({ err: 'Failed to remove story msg' })

  }
}

module.exports = {
  getStorys,
  getStoryById,
  addStory,
  updateStory,
  removeStory,
  addStoryMsg,
  removeStoryMsg,
  changeLikeStatus
}
