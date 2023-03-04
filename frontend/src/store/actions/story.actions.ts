import { FilterBy } from "../../interfaces/filterBy"
import { storyService } from "../../services/story.service"

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

export function setFilterBy(filterBy: FilterBy) {
    return (dispatch: Function) => {
        dispatch({ type: 'SET_FILTER', filterBy })
        return 'hello'
    }
}