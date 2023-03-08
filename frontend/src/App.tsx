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
import { UserInfo } from './interfaces/user'
import { useSelector } from 'react-redux'
import { RootState } from './interfaces/state'
import { socketService } from './services/socket.service'

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

  useEffect(() => {
    eventBus.on('openUserListModal', ({ userList, title }: EmitData) => {
      setlikeList(userList)
      setUserListModaltitle(title)
      setIsOpenedLikeList(true)
    })
    socketService.on('send-notification', console.log)
  }, [])

  useEffect(() => {
    const elBody = document.querySelector('body')
    if (isDarkMode && elBody) elBody.style.backgroundColor = 'rgb(0,0,0)'
    else if (!isDarkMode && elBody) elBody.style.backgroundColor = 'white'
  }, [isDarkMode])


  return (
    <Router>
      <section className='main-page'>
        {(isOpenedLikeList && likeList) && <UserListModal
          setIsOpenedLikeList={setIsOpenedLikeList}
          likeList={likeList}
          title={userListModaltitle}
        />
        }
        {isLogin && <div onClick={() => setIsLogin(false)} className="opacity-wrapper"></div>}
        {isLogin && <div className='login-signup-container'>
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
          </Routes>
        </section>
      </section>
    </Router>
  )
}

export default App
