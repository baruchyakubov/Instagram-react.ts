import { FilterByUsers } from "../../interfaces/filterBy";
import { Login, Signup } from "../../interfaces/login-signupCred";
import { User } from "../../interfaces/user";
import { userService } from "../../services/user.service"

export function getUsers() {
    return async (dispatch: Function, getState: Function) => {
        const users = await userService.getUsers(getState().userModule.filterBy)
        dispatch({ type: 'GET_USERS', users })
    }
}

export function getSearchedUsers() {
    return async (dispatch: Function, getState: Function) => {
        const searchedUsers = await userService.getUsers(getState().userModule.filterBy)
        dispatch({ type: 'GET_SEARCHED_USERS', searchedUsers })
    }
}

export function setFilterBy(filterBy: FilterByUsers) {
    return (dispatch: Function) => {
        dispatch({ type: 'SET_USER_FILTER', filterBy })
        return 'hello'
    }
}

export function login(userCreds: Login) {
    return async (dispatch: Function) => {
        try {
            const loggedInUser = await userService.login(userCreds)
            dispatch({ type: 'SET_LOGGED_IN_USER', loggedInUser })
        } catch (err) {
            console.log(err);
        }
    }
}

export function signup(userCreds: Signup) {
    return async (dispatch: Function) => {
        try {
            await userService.signup(userCreds)
            const users = await userService.getUsers()
            dispatch({ type: 'GET_USERS', users })
            const loggedInUser = await userService.login(userCreds)
            dispatch({ type: 'SET_LOGGED_IN_USER', loggedInUser })
        } catch (err) {
            console.log(err);
        }
    }
}

export function logout() {
    return (dispatch: Function) => {
        userService.logout()
        dispatch({ type: 'LOGOUT' })
    }
}

export function updateUser(user: User) {
    return async (dispatch: Function) => {
        userService.updateUser(user)
        userService.setLoggedInUser(user)
        const users = await userService.getUsers()
        dispatch({ type: 'GET_USERS', users })
        dispatch({ type: 'UPDATE_USER', user })
    }
}