import { Navbar } from './cmps/NavBar'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Explore } from './views/Explore'
import { StoryDetails } from './views/StoryDetails'
import { ProfilePage } from './views/ProfilePage'
import { LoginPage } from './cmps/LoginPage'
import { useEffect, useState } from 'react'
import { HeaderMobile } from './cmps/HeaderMobile'
import { LikeList } from './cmps/LikeList'
import { eventBus } from './services/event-bus.service'
import { LikedBy } from './interfaces/story'

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [isOpenedLikeList, setIsOpenedLikeList] = useState(false)
  const [likeList, setlikeList] = useState<LikedBy[] | null>(null)

  useEffect(() => {
    eventBus.on('openLikeList', (likedBy: LikedBy[]) => {
      setlikeList(likedBy)
      setIsOpenedLikeList(true)
    })
  }, [])


  return (
    <Router>
      <section className='main-page'>
        {(isOpenedLikeList && likeList) && <LikeList
          setIsOpenedLikeList={setIsOpenedLikeList}
          likeList={likeList}
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
