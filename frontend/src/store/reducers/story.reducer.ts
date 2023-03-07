import { FilterBy } from "../../interfaces/filterBy"
import { Story } from "../../interfaces/story"
import { utilService } from "../../services/util.service"

const INITIAL_STATE = {
    storys: null,
    filterBy: { userId: '' },
    isDarkMode: utilService.loadFromStorage('appearance') || false
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
        case 'TOGGLE_APPERANCE':
            return {
                ...state,
                isDarkMode: !state.isDarkMode
            }
        default:
            return state
    }
}