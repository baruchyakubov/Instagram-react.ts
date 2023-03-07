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

export function Navbar({ setIsLogin }: Props) {
    const [isSearchOpened, setIsSearchOpened] = useState(false)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

    const navItems = [
        { id: 'b101', name: 'Home', logo: <HomeSvg></HomeSvg>, route: '/' }, { id: 'b102', name: 'Search', logo: <SearchLogo></SearchLogo>, route: '' },
        { id: 'b103', name: 'Explore', logo: <ExploreLogo></ExploreLogo>, route: '/explore' },
        { id: 'b104', name: 'Appearance', logo: <SwitchAppearance></SwitchAppearance>, route: '' },
        {
            id: 'b105',
            name: loggedInUser?._id ? 'Profile' : 'Login',
            logo: loggedInUser?._id ? <img src={loggedInUser?.imgUrl} alt="" /> : <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/v1677966828/ajwihd1ezvwiezqi4p2y.png" alt="" />,
            route: loggedInUser?._id ? `/profile/${loggedInUser._id}` : '',
        }
    ]

    const ToggleApperance = (): void => {
        if (isDarkMode) document.querySelector('body')?.classList.remove('dark-mode')
        else document.querySelector('body')?.classList.add('dark-mode')
        dispatch(toggleApperance())
    }

    return (
        <>
            <SearchContainer setIsSearchOpened={setIsSearchOpened} isSearchOpened={isSearchOpened}></SearchContainer>
            <section className={`side-navbar ${isSearchOpened ? 'opened' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
                <NavLink to="/" className="instagram-logo">
                    <InstagramLogo></InstagramLogo>
                </NavLink>
                <NavLink to="/" className={`instagram-logo-mobile ${isDarkMode ? 'dark-mode' : ''}`}>
                    <InstagramLogoMobile></InstagramLogoMobile>
                </NavLink>
                <nav>
                    {navItems.map(item => {
                        if (item.name === 'Search') {
                            return <div className={isDarkMode ? 'dark-mode' : ''} onClick={() => setIsSearchOpened(true)} key={item.id}>
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Login') {
                            return <div className={isDarkMode ? 'dark-mode' : ''} onClick={() => { if (setIsLogin) setIsLogin(true) }} key={item.id}>
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Appearance') {
                            return <div className={isDarkMode ? 'dark-mode' : ''} onClick={() => ToggleApperance()} key={item.id}>
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        return (
                            <NavLink className={item.name + ' ' + (isDarkMode ? 'dark-mode' : '')} key={item.id} to={item.route}>
                                {item.logo}
                                <h1>{item.name}</h1>
                            </NavLink>
                        )
                    })}
                </nav>
            </section>
        </>
    )
}