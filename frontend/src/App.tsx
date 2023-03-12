import { Navbar } from './cmps/NavBar'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Explore } from './views/Explore'
import { StoryDetails } from './views/StoryDetails'
import { ProfilePage } from './views/ProfilePage'
import { LoginPage } from './cmps/LoginPage'
import { useEffect, useState } from 'react'
import { HeaderMobile } from './cmps/HeaderMobile'
import { UserListModal } from './cmps/UserListModal'
import { eventBus, showSuccessMsg } from './services/event-bus.service'
import { Notification, UserInfo } from './interfaces/user'
import { useDispatch, useSelector } from 'react-redux'
import { INITIAL_STATE, RootState } from './interfaces/state'
import { socketService } from './services/socket.service'
import { NotificationsPage } from './views/NotificationsPage'
import { setLoggedInUser, updateFollowStatus } from './store/actions/user.actions'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { UserMsg } from './cmps/UserMsg'
import { updatedStory } from './store/actions/story.actions'
import { Story } from './interfaces/story'

interface EmitData {
  userList: UserInfo[]
  title: string
}

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [isOpenedLikeList, setIsOpenedLikeList] = useState(false)
  const [likeList, setlikeList] = useState<UserInfo[] | null>(null)
  const [userListModaltitle, setUserListModaltitle] = useState('')
  const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
  const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
  const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

  useEffect(() => {
    socketService.on('show-comment-to-all', (story: Story) => dispatch(updatedStory(story)))
    const listener = eventBus.on('openUserListModal', ({ userList, title }: EmitData) => {
      setlikeList(userList)
      setUserListModaltitle(title)
      setIsOpenedLikeList(true)
    })
    const listener2 = eventBus.on('updateFollowStatus', ({ updatedStatus, userId }: { updatedStatus: string, userId: string }) => UpdateFollowStatus(updatedStatus, userId))
    return () => {
      listener()
      listener2()
    }
  }, [])

  useEffect(() => {
    if (loggedInUser) {
      socketService.on('send-notification', addNotification)
    }
    else socketService.off('send-notification')
  }, [loggedInUser?._id])

  const addNotification = (notification: Notification): void => {
    if (loggedInUser) {
      const updatedLoggedInUser = { ...loggedInUser }
      updatedLoggedInUser.notifications?.unshift(notification)
      dispatch(setLoggedInUser(updatedLoggedInUser))
      showSuccessMsg(`${notification.by.username} ${notification.txt}`)
    }
  }

  const checkIfFollowing = (userId: string): boolean => {
    const user = loggedInUser?.following.find(user => {
      return user._id === userId
    })
    return user ? true : false
  }

  const UpdateFollowStatus = (updatedStatus: string, userId: string): void => {
    dispatch(updateFollowStatus(updatedStatus, userId))
  }

  useEffect(() => {
    const elBody = document.querySelector('body')
    if (isDarkMode && elBody) elBody.style.backgroundColor = 'rgb(0,0,0)'
    else if (!isDarkMode && elBody) elBody.style.backgroundColor = 'white'
  }, [isDarkMode])


  return (
    <Router>
      <section className='main-page'>
        <UserMsg></UserMsg>
        {(isOpenedLikeList && likeList)
          && <UserListModal
            setIsOpenedLikeList={setIsOpenedLikeList}
            UpdateFollowStatus={UpdateFollowStatus}
            checkIfFollowing={checkIfFollowing}
            likeList={likeList}
            title={userListModaltitle}
          />
        }
        {isLogin && <div onClick={() => setIsLogin(false)} className="opacity-wrapper"></div>}
        {isLogin && <div className={`login-signup-container ${isDarkMode ? 'dark-mode' : ''}`}>
          <LoginPage setIsLogin={setIsLogin}></LoginPage>
        </div>}
        <HeaderMobile></HeaderMobile>
        <Navbar setIsLogin={setIsLogin}></Navbar>
        <section className='view-section'>
          <Routes>
            <Route path='profile/:userId' element={<ProfilePage />}>
              <Route path='details/:id/:idx' element={<StoryDetails />}></Route>
            </Route>
            <Route path='/explore' element={<Explore />}>
              <Route path='details/:id/:idx' element={<StoryDetails />}></Route>
            </Route>
            <Route path='/' element={<Home />}>
              <Route path='details/:id/:idx' element={<StoryDetails />}></Route>
            </Route>
            <Route path='/Notifications' element={<NotificationsPage />} />
          </Routes>
        </section>
      </section>
    </Router>
  )
}

export default App
