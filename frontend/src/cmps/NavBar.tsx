import { HomeSvg } from '../svg-cmps/HomeSvg'
import { InstagramLogo } from '../svg-cmps/InstagramLogo'
import { SearchLogo } from '../svg-cmps/SearchLogo'
import { ExploreLogo } from '../svg-cmps/ExploreLogo'
import { NavLink } from 'react-router-dom'
import { InstagramLogoMobile } from '../svg-cmps/InstagramLogoMobile'
import { SearchContainer } from './SearchContainer'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { INITIAL_STATE, RootState } from '../interfaces/state'
import { Props } from '../interfaces/props'
import { SwitchAppearance } from '../svg-cmps/SwitchAppearance'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { toggleApperance } from '../store/actions/story.actions'
import { NotificationsLogo } from '../svg-cmps/NotificationsLogo'
import { CreateLogo } from '../svg-cmps/CreateLogo'
import { showErrorMsg } from '../services/event-bus.service'

export function Navbar({ setIsCreateModalOpen, setIsLogin }: Props) {
    const [isSearchOpened, setIsSearchOpened] = useState(false)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)

    const navItems = [
        { id: 'b101', name: 'Home', logo: <HomeSvg></HomeSvg>, route: '/' },
        { id: 'b102', name: 'Search', logo: <SearchLogo></SearchLogo>, route: '' },
        { id: 'b103', name: 'Explore', logo: <ExploreLogo></ExploreLogo>, route: '/explore' },
        { id: 'b104', name: 'Create', logo: <CreateLogo></CreateLogo>, route: '' },
        { id: 'b105', name: 'Appearance', logo: <SwitchAppearance></SwitchAppearance>, route: '' },
        { id: 'b106', name: 'Notifications', logo: <NotificationsLogo></NotificationsLogo>, route: '/Notifications' },
        {
            id: 'b107',
            name: loggedInUser?._id ? 'Profile' : 'Login',
            logo: loggedInUser?._id ?
                <img src={loggedInUser?.imgUrl} alt="" /> :
                isDarkMode ?
                    <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1678393640/bvlgm7dzj4tzeruw9vi6.png" alt="" /> :
                    <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/v1677966828/ajwihd1ezvwiezqi4p2y.png" alt="" />,
            route: loggedInUser?._id ? `/profile/${loggedInUser._id}` : '',
        }
    ]

    const ToggleApperance = (): void => {
        if (isDarkMode) document.querySelector('body')?.classList.remove('dark-mode')
        else document.querySelector('body')?.classList.add('dark-mode')

        dispatch(toggleApperance())
    }

    const openCreateModal = () => {
        if (!loggedInUser) {
            showErrorMsg('Login required')
            return
        }
        if (setIsCreateModalOpen)
            setIsCreateModalOpen(true)
    }

    return (
        <>
            <SearchContainer setIsSearchOpened={setIsSearchOpened} isSearchOpened={isSearchOpened}></SearchContainer>
            <section className={`side-navbar ${isSearchOpened ? 'opened' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
                <NavLink to="/" className="instagram-logo">
                    <InstagramLogo></InstagramLogo>
                </NavLink>
                <NavLink to="/" className="instagram-logo-mobile">
                    <InstagramLogoMobile></InstagramLogoMobile>
                </NavLink>
                <nav>
                    {navItems.map(item => {
                        if (item.name === 'Search') {
                            return <div
                                onClick={() => setIsSearchOpened(true)}
                                key={item.id}
                                className="search-nav-item"
                            >
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Login') {
                            return <div
                                onClick={() => { if (setIsLogin) setIsLogin(true) }}
                                key={item.id}
                            >
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Appearance') {
                            return <div
                                onClick={() => ToggleApperance()}
                                key={item.id}
                            >
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Create') {
                            return <div
                                onClick={openCreateModal}
                                key={item.id}
                            >
                                {item.logo}
                                < h1 > {item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Notifications' && !loggedInUser) return
                        return (
                            <NavLink
                                className={item.name}
                                key={item.id}
                                to={item.route}
                            >
                                {item.logo}
                                <h1>{item.name}</h1>
                            </NavLink>
                        )
                    })}
                </nav>
            </section >
        </>
    )
}