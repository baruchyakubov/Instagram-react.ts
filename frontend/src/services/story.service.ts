import { By, createdBy, Story } from '../interfaces/story';
import { httpService } from './http.service';

export const storyService = {
  query,
  getById,
  changeLikeStatus,
  addStoryComment,
  addStory,
  deleteStory
}

const STORAGE_KEY = 'story'

async function query(filterBy = { userId: '' }) {
  try {
    return await httpService.get(STORAGE_KEY, filterBy)
  } catch (err) {
    throw err
  }
}

async function addStory(storyData: { text: string, imgUrls: string[], createdBy: createdBy }) {
  try {
    return await httpService.post(STORAGE_KEY,  storyData )
  } catch (err) {
    throw err
  }
}

async function deleteStory(storyId: string | undefined) {
  try {
    return await httpService.delete(`${STORAGE_KEY}/${storyId}`)
  } catch (err) {
    throw err
  }
}

async function getById(storyId: string) {
  try {
    return await httpService.get(`${STORAGE_KEY}/${storyId}`)
  } catch (err) {
    throw err
  }
}

async function changeLikeStatus(updatedStatus: boolean, story: Story) {
  try {
    return await httpService.put(`${STORAGE_KEY}/like-status-change/${story._id}`, { updatedStatus, story })
  } catch (err) {
    throw err
  }
}

async function addStoryComment(loggedInUserInfo: By, comment: string, story: Story) {
  try {
    return await httpService.post(`${STORAGE_KEY}/comment/${loggedInUserInfo._id}`, { comment, story, loggedInUserInfo })
  } catch (err) {
    throw err
  }
}