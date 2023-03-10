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

export function changeLikeStatus(updatedStatus: boolean, storyId: string) {
    return async (dispatch: Function) => {
        try {
            const { updatedStory, updatedUser } = await storyService.changeLikeStatus(updatedStatus, storyId)
            dispatch({ type: 'UPDATE_USER', user: userService.setLoggedInUser(updatedUser) })
            dispatch({ type: 'UPDATE_STORY', updatedStory })
            return 'hello'
        } catch (err) {
            console.log(err);
        }

    }
}