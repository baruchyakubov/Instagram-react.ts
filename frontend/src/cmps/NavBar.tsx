import { HomeSvg } from '../svg-cmps/HomeSvg'
import { InstagramLogo } from '../svg-cmps/InstagramLogo'
import { SearchLogo } from '../svg-cmps/SearchLogo'
import { ExploreLogo } from '../svg-cmps/ExploreLogo'
import { NavLink } from 'react-router-dom'
import { InstagramLogoMobile } from '../svg-cmps/InstagramLogoMobile'
import { SearchContainer } from './SearchContainer'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../interfaces/state'
import { Props } from '../interfaces/props'

export function Navbar({ setIsLogin }: Props) {
    const [isSearchOpened, setIsSearchOpened] = useState(false)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)

    const navItems = [
        { id: 'b101', name: 'Home', logo: <HomeSvg></HomeSvg>, route: '/' }, { id: 'b102', name: 'Search', logo: <SearchLogo></SearchLogo>, route: '' },
        { id: 'b103', name: 'Explore', logo: <ExploreLogo></ExploreLogo>, route: '/explore' },
        {
            id: 'b104',
            name: loggedInUser?._id ? 'Profile' : 'Login',
            logo: loggedInUser?._id ? <img src={loggedInUser?.imgUrl} alt="" /> : <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/v1677966828/ajwihd1ezvwiezqi4p2y.png" alt="" />,
            route: loggedInUser?._id ? `/profile/${loggedInUser._id}` : '',
        }
    ]

    return (
        <>
            <SearchContainer setIsSearchOpened={setIsSearchOpened} isSearchOpened={isSearchOpened}></SearchContainer>
            <section className={`side-navbar ${isSearchOpened ? 'opened' : ''}`}>
                <NavLink to="/" className="instagram-logo">
                    <InstagramLogo></InstagramLogo>
                </NavLink>
                <NavLink to="/" className="instagram-logo-mobile">
                    <InstagramLogoMobile></InstagramLogoMobile>
                </NavLink>
                <nav>
                    {navItems.map(item => {
                        if (item.name === 'Search') {
                            return <div onClick={() => setIsSearchOpened(true)} key={item.id}>
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        if (item.name === 'Login') {
                            return <div onClick={() => { if (setIsLogin) setIsLogin(true) }} key={item.id}>
                                {item.logo}
                                <h1>{item.name}</h1>
                            </div>
                        }
                        return (
                            <NavLink className={item.name} key={item.id} to={item.route}>
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