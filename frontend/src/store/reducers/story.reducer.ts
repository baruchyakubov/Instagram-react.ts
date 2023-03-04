import { FilterBy } from "../../interfaces/filterBy"
import { Story } from "../../interfaces/story"

const INITIAL_STATE = {
    storys: null,
    filterBy: { userId: '' }
}

export function storyReducer(state = INITIAL_STATE, action: { type: string, storys: Array<Story>, filterBy: FilterBy }) {

    switch (action.type) {
        case 'SET_STORYS':
            return {
                ...state,
                storys: action.storys
            }
        case 'RESET_STORYS':
            return {
                ...state,
                storys: null
            }
        case 'SET_FILTER':
            return {
                ...state,
                filterBy: action.filterBy
            }
        default:
            return state
    }
}