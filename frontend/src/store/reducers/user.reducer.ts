import { FilterByUsers } from "../../interfaces/filterBy";
import { User } from "../../interfaces/user";
import { userService } from "../../services/user.service";


const INITIAL_STATE = {
    users: [],
    searchedUsers: [],
    loggedInUser: userService.getLoggedInUser(),
    filterBy: { txt: '' }
}

export function userReducer(state = INITIAL_STATE, action: { type: string, users: Array<User>, loggedInUser: User, searchedUsers: Array<User>, filterBy: FilterByUsers, user: User }) {

    switch (action.type) {
        case 'GET_USERS':
            return {
                ...state,
                users: action.users
            }
        case 'GET_SEARCHED_USERS':
            return {
                ...state,
                searchedUsers: action.searchedUsers
            }
        case 'SET_FILTER':
            return {
                ...state,
                filterBy: action.filterBy
            }
        case 'SET_LOGGED_IN_USER':
            return {
                ...state,
                loggedInUser: action.loggedInUser
            }
        case 'LOGOUT':
            return {
                ...state,
                loggedInUser: null
            }
        case 'UPDATE_USER':
            return {
                ...state,
                loggedInUser: action.user
            }

        default:
            return state;
    }
}