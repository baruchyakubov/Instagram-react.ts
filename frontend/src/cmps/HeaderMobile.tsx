import { useState, useRef, SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { setFilterBy, getSearchedUsers } from "../store/actions/user.actions";
import { InstagramLogoMobile } from "../svg-cmps/InstagramLogoMobile";
import { SearchList } from "./SearchList";

export function HeaderMobile() {
    const [isRecentShown, setIsRecentShown] = useState(true)
    const [isSearchOpened, setIsSearchOpened] = useState(false)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const users = useSelector((state: RootState) => state.userModule.searchedUsers)
    const inputEl2 = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLInputElement>(null);

    const closeSearchContainer = () => {
        if (setIsSearchOpened) setIsSearchOpened(false)
    }

    const startSearch = (ev: SyntheticEvent) => {
        const target = ev.target as any
        if (!target.value.length) setIsRecentShown(true)
        else if (target.value.length === 1) setIsRecentShown(false)
        dispatch(setFilterBy({ txt: target.value }))
        dispatch(getSearchedUsers())
    }

    const openSearchList = () => {
        if (isSearchOpened) return
        document.addEventListener('click', (ev) => handleClickOutside(ev), true);
        setIsSearchOpened(true)
    }

    const handleClickOutside = (event: MouseEvent) => {
        let target = event.target as HTMLTextAreaElement

        if (ref.current && !ref.current.contains(target)) {
            setIsSearchOpened(false)
            document.removeEventListener('click', (ev) => handleClickOutside(ev), true);
        }
    };



    const clearInput = () => {
        if (inputEl2.current) inputEl2.current.value = ''
        setIsRecentShown(true)
    }

    return (
        <>
            <header className="home-header">
                <NavLink to="/">
                    <InstagramLogoMobile></InstagramLogoMobile>
                </NavLink>
                <div className="search">
                    <svg aria-label="Search" color="rgb(142, 142, 142)" fill="rgb(142, 142, 142)" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
                    <input ref={inputEl2} onClick={openSearchList} onInput={startSearch} type="search" placeholder="Search" />
                </div>
            </header>
            {isSearchOpened && <div ref={ref} className="search-list-mobile">
                <SearchList clearInput={clearInput} users={users} isRecentShown={isRecentShown} closeSearchContainer={closeSearchContainer}></SearchList>
            </div>}
        </>


    )
}