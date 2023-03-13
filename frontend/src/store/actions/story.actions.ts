import { FilterBy } from "../../interfaces/filterBy"
import { By, createdBy, Story } from "../../interfaces/story"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { storyService } from "../../services/story.service"
import { utilService } from "../../services/util.service"

export function loadStorys() {
    return async (dispatch: Function, getState: Function) => {
        try {
            const storys = await storyService.query(getState().storyModule.filterBy)
            dispatch({ type: 'SET_STORYS', storys })
            return 'hello'
        } catch (err) {
            showErrorMsg('Failed to get posts')
        }
    }
}

export function addStory(storyData: { text: string, imgUrls: string[] ,createdBy: createdBy} , navigate: Function) {
    return async (dispatch: Function) => {
        try {
            const story = await storyService.addStory(storyData)
            console.log(story);
            dispatch({ type: 'ADD_STORY', story })
            navigate('/')
            showSuccessMsg('Post added succesfully')
            return 'hello'
        } catch (err) {
            showErrorMsg('Failed to get posts')
        }
    }
}

export function deleteStory(storyId: string | undefined) {
    return async (dispatch: Function) => {
        try {
            const StoryId = await storyService.deleteStory(storyId)
            console.log(StoryId);
            dispatch({ type: 'DELETE_STORY', StoryId })
            showSuccessMsg('Post deleted succesfully')
            return 'hello'
        } catch (err) {
            showErrorMsg('Failed to delete post')
        }
    }
}

export function resetStorys() {
    return (dispatch: Function) => {
        dispatch({ type: 'RESET_STORYS' })
        return 'hello'
    }
}

export function updatedStory(updatedStory: Story) {
    return (dispatch: Function) => {
        dispatch({ type: 'UPDATE_STORY', updatedStory })
        return 'hello'
    }
}

export function toggleApperance() {
    return (dispatch: Function, getState: Function) => {
        utilService.saveToStorage('appearance', !getState().storyModule.isDarkMode)
        dispatch({ type: 'TOGGLE_APPERANCE' })
        return 'hello'
    }
}
export function setFilterBy(filterBy: FilterBy) {
    return (dispatch: Function) => {
        dispatch({ type: 'SET_FILTER', filterBy })
        return 'hello'
    }
}

export function addUserComment(comment: string, story: Story) {
    return async (dispatch: Function, getState: Function) => {
        try {
            const loggedInUser = { ...getState().userModule.loggedInUser }
            const loggedInUserInfo = { _id: loggedInUser._id, username: loggedInUser.username, imgUrl: loggedInUser.imgUrl }
            const updatedStory = await storyService.addStoryComment(loggedInUserInfo, comment, story)
            dispatch({ type: 'UPDATE_STORY', updatedStory })
        } catch (err) {
            showErrorMsg('Failed to add comment')

        }
        return 'hello'
    }
}


export function changeLikeStatus(updatedStatus: boolean, story: Story, setIsSettingLikeStatus: Function) {
    return async (dispatch: Function) => {
        try {
            const updatedStory = await storyService.changeLikeStatus(updatedStatus, story)
            dispatch({ type: 'UPDATE_STORY', updatedStory })
            setIsSettingLikeStatus(false)
            return 'hello'
        } catch (err) {
            showErrorMsg('Failed to add like')
        }

    }
}