import { By, Story } from '../interfaces/story';
import { httpService } from './http.service';

export const storyService = {
  query,
  getById,
  changeLikeStatus,
  addStoryComment
}

const STORAGE_KEY = 'story'

async function query(filterBy = { userId: '' }) {
  try {
    return await httpService.get(STORAGE_KEY, filterBy)
  } catch (err) {
    throw err
  }
}

async function getById(storyId: string) {
  try {
    return await httpService.get(`story/${storyId}`)
  } catch (err) {
    throw err
  }
}

async function changeLikeStatus(updatedStatus: boolean, story: Story) {
  try {    
    return await httpService.put(`story/like-status-change/${story._id}`, {updatedStatus , story})
  } catch (err) {
    throw err
  }
}

async function addStoryComment(loggedInUserInfo: By , comment: string, story: Story) {
  try {    
    return await httpService.post(`story/comment/${loggedInUserInfo._id}`, {comment , story , loggedInUserInfo})
  } catch (err) {
    throw err
  }
}