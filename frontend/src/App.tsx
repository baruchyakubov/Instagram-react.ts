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
import { eventBus, showErrorMsg, showSuccessMsg } from './services/event-bus.service'
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
import { CreateStoryModal } from './cmps/CreateStoryModal'
import { useCheckIfFollowing } from './custom-hooks/useCheckIfFollowing'

interface EmitData {
  userList: UserInfo[]
  title: string
}

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isOpenedLikeList, setIsOpenedLikeList] = useState(false)
  const [likeList, setlikeList] = useState<UserInfo[] | null>(null)
  const [isSettingFollowStatus, setIsSettingFollowStatus] = useState<boolean>(false)
  const [userListModaltitle, setUserListModaltitle] = useState('')
  const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
  const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
  const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

  useEffect(() => {
    socketService.on('show-comment-to-all', (story: Story) => dispatch(updatedStory(story)))
    const unSubscribe = eventBus.on('openUserListModal', ({ userList, title }: EmitData) => {
      setlikeList(userList)
      setUserListModaltitle(title)
      setIsOpenedLikeList(true)
    })
    return () => {
      unSubscribe()
      socketService.off('show-comment-to-all')
    }
  }, [])

  useEffect(() => {
    const elBody = document.querySelector('body')
    if (isDarkMode && elBody) elBody.style.backgroundColor = 'rgb(0,0,0)'
    else if (!isDarkMode && elBody) elBody.style.backgroundColor = 'white'
  }, [isDarkMode])

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

  const checkIfFollowing = (userId: string) => useCheckIfFollowing(userId , loggedInUser)

  const UpdateFollowStatus = (updatedStatus: string, userId: string, username: string): void => {
    if (isSettingFollowStatus) return
    if (!loggedInUser) {
      showErrorMsg('Login required')
      return
    }
    setIsSettingFollowStatus(true)
    dispatch(updateFollowStatus(updatedStatus, userId, setIsSettingFollowStatus, username))
  }

  return (
    <Router>
      <section className='main-page'>
        <UserMsg></UserMsg>
        {isCreateModalOpen && <CreateStoryModal setIsCreateModalOpen={setIsCreateModalOpen} ></CreateStoryModal>}
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
        <Navbar setIsCreateModalOpen={setIsCreateModalOpen} setIsLogin={setIsLogin}></Navbar>
        <section className='view-section'>
          <Routes>
            <Route path='profile/:userId' element={<ProfilePage UpdateFollowStatus={UpdateFollowStatus} />}>
              <Route path='details/:id/:idx' element={<StoryDetails />}></Route>
            </Route>
            <Route path='/explore' element={<Explore />}>
              <Route path='details/:id/:idx' element={<StoryDetails />}></Route>
            </Route>
            <Route path='/' element={<Home UpdateFollowStatus={UpdateFollowStatus} />}>
              <Route path='details/:id/:idx' element={<StoryDetails />}></Route>
            </Route>
            <Route path='/Notifications' element={<NotificationsPage UpdateFollowStatus={UpdateFollowStatus} />} />
          </Routes>
        </section>
      </section>
    </Router>
  )
}

export default App
