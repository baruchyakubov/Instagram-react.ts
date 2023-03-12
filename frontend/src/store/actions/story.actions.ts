import { FilterBy } from "../../interfaces/filterBy"
import { Story } from "../../interfaces/story"
import { storyService } from "../../services/story.service"
import { userService } from "../../services/user.service"
import { utilService } from "../../services/util.service"

export function loadStorys() {
    return async (dispatch: Function, getState: Function) => {
        try {
            const storys = await storyService.query(getState().storyModule.filterBy)
            dispatch({ type: 'SET_STORYS', storys })
            return 'hello'
        } catch (err) {
            console.log('err:', err)
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
            console.log(err);

        }
        return 'hello'
    }
}


export function changeLikeStatus(updatedStatus: boolean, story: Story) {
    return async (dispatch: Function) => {
        try {
            const updatedStory = await storyService.changeLikeStatus(updatedStatus, story)
            dispatch({ type: 'UPDATE_STORY', updatedStory })
            return 'hello'
        } catch (err) {
            console.log(err);
        }

    }
}