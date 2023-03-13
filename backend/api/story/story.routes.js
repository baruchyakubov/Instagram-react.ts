const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStorys, getStoryById, addStory, updateStory, removeStory, addStoryComment, changeLikeStatus } = require('./story.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStorys)
router.get('/:id', getStoryById)
router.post('/', requireAuth, addStory)
router.put('/:id', requireAuth, updateStory)
router.put('/like-status-change/:id', requireAuth, changeLikeStatus)
router.delete('/:id', requireAuth, removeStory)
// router.delete('/:id', requireAuth, requireAdmin, removeStory)

router.post('/comment/:id', requireAuth, addStoryComment)

module.exports = router