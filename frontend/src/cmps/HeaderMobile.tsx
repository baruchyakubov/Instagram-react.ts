import { useState, useRef, SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useHandleClickOutside } from "../custom-hooks/useHandleClickOutside";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { setFilterBy, getSearchedUsers } from "../store/actions/user.actions";
import { InstagramLogoMobile } from "../svg-cmps/InstagramLogoMobile";
import { SearchLogo2 } from "../svg-cmps/SearchLogo2";
import { SearchList } from "./SearchList";

export function HeaderMobile() {
    const [isRecentShown, setIsRecentShown] = useState(true)
    const [isSearchOpened, setIsSearchOpened] = useState(false)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const users = useSelector((state: RootState) => state.userModule.searchedUsers)
    const inputEl2 = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLInputElement>(null);
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    useHandleClickOutside(ref, () => setIsSearchOpened(false))

    const closeSearchContainer = () => {
        if (setIsSearchOpened) setIsSearchOpened(false)
    }

    const startSearch = (ev: SyntheticEvent): void => {
        const target = ev.target as any
        if (!target.value.length) setIsRecentShown(true)
        else if (target.value.length === 1) setIsRecentShown(false)
        dispatch(setFilterBy({ txt: target.value }))
        dispatch(getSearchedUsers())
    }

    const openSearchList = (): void => {
        if (isSearchOpened) return
        setIsSearchOpened(true)
    }

    const clearInput = (): void => {
        if (inputEl2.current) inputEl2.current.value = ''
        setIsRecentShown(true)
    }

    return (
        <>
            <header className={`home-header ${isDarkMode ? 'dark-mode' : ''}`}>
                <NavLink to="/">
                    <InstagramLogoMobile></InstagramLogoMobile>
                </NavLink>
                <div className="search">
                    <SearchLogo2></SearchLogo2>
                    <input
                        ref={inputEl2}
                        onClick={openSearchList}
                        onInput={startSearch}
                        type="search"
                        placeholder="Search" />
                </div>
            </header>
            {isSearchOpened && <div ref={ref} className={`search-list-mobile ${isDarkMode ? 'dark-mode' : ''}`}>
                <SearchList
                    clearInput={clearInput}
                    users={users}
                    isRecentShown={isRecentShown}
                    closeSearchContainer={closeSearchContainer}
                />
            </div>}
        </>


    )
}