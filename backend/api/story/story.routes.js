const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStorys, getStoryById, addStory, updateStory, removeStory, addStoryMsg, removeStoryMsg } = require('./story.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStorys)
router.get('/:id', getStoryById)
router.post('/', requireAuth, addStory)
router.put('/:id', requireAuth, updateStory)
router.delete('/:id', requireAuth, removeStory)
// router.delete('/:id', requireAuth, requireAdmin, removeStory)

router.post('/:id/msg', requireAuth, addStoryMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeStoryMsg)

module.exports = router