import { Login, Signup } from '../interfaces/login-signupCred';
import { SavedPosts, User } from '../interfaces/user';
import { httpService } from './http.service';
import { socketService } from './socket.service';
import { utilService } from './util.service';


export const userService = {
    getUsers,
    getById,
    login,
    getLoggedInUser,
    logout,
    signup,
    updateUser,
    setLoggedInUser,
    updateFollowStatus,
    changeSaveStatus
}

declare global {
    interface Window {
        userService: any;
    }
}

window.userService = userService

async function getUsers(filterBy = { txt: '', limit: null }) {
    try {
        return await httpService.get('user', filterBy)
    } catch (err) {
        throw err
    }
}

async function getById(userId: string) {
    try {
        return await httpService.get(`user/${userId}`)
    } catch (err) {
        throw err
    }
}

async function login(userCred: Login) {
    try {
        const user = await httpService.post('auth/login', userCred)
        if (user) {
            socketService.login(user._id)
            return setLoggedInUser(user)
        } else throw 'User does not match'

    }
    catch (err) {
        throw err
    }
}

async function signup(userCred: Signup) {
    try {
        return await httpService.post('auth/signup', userCred)
    } catch (err) {
        throw err
    }
}

async function logout() {
    try {
        await httpService.post('auth/logout')
        localStorage.removeItem('loggedInUser')
        socketService.logout()
    } catch (err) {
        throw err
    }
}

function getLoggedInUser() {
    const loggedInUser = utilService.loadFromStorage('loggedInUser')
    return loggedInUser
}

function setLoggedInUser(user: User) {
    utilService.saveToStorage('loggedInUser', {...user})
    return user
}

async function updateUser(user: User) {
    try {
        return await httpService.put(`user/${user._id}`, user)
    } catch (err) {
        throw err
    }
}

async function updateFollowStatus(updatedStatus: string, userId: string) {
    try {
        const user = await httpService.put(`user/follow-status/${userId}`, { updatedStatus })
        setLoggedInUser(user)
        return user
    } catch (err) {
        throw err
    }
}

async function changeSaveStatus(updatedStatus: boolean, loggedInUserId: string , story: SavedPosts) {
    try {    
      await httpService.put(`user/save-status-change/${loggedInUserId}`, {updatedStatus , story})
    } catch (err) {
      throw err
    }
  }



