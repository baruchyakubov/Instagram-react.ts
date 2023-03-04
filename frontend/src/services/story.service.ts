import { httpService } from './http.service';

export const storyService = {
  query,
  getById,
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