import { SyntheticEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk/es/types";
import { Props } from "../interfaces/props";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { getSearchedUsers, setFilterBy } from "../store/actions/user.actions";
import { CloseBtn2 } from "../svg-cmps/CloseBtn2";
import { SearchList } from "./SearchList";

export function SearchContainer({ isSearchOpened, setIsSearchOpened }: Props) {
    const [isRecentShown, setIsRecentShown] = useState(true)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const users = useSelector((state: RootState) => state.userModule.searchedUsers)
    const inputEl = useRef<HTMLInputElement>(null);
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    const closeSearchContainer = (): void => {
        if (setIsSearchOpened) setIsSearchOpened(false)
    }

    const startSearch = (ev: SyntheticEvent): void => {
        const target = ev.target as any
        if (!target.value.length) setIsRecentShown(true)
        else if (target.value.length === 1) setIsRecentShown(false)
        dispatch(setFilterBy({ txt: target.value, limit: null }))
        dispatch(getSearchedUsers())
    }

    const clearInput = (): void => {
        if (inputEl.current) inputEl.current.value = ''
        setIsRecentShown(true)
    }


    return (
        <section className={`search-container ${isSearchOpened ? 'opened' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="row-1">
                <div className="search-header">
                    <h2>Search</h2>
                    <div onClick={() => {
                        if (setIsSearchOpened) setIsSearchOpened(false)
                    }
                    }>
                        <CloseBtn2></CloseBtn2>
                    </div>
                </div>
                <div className="search">
                    <svg aria-label="Search" color="rgb(142, 142, 142)" fill="rgb(142, 142, 142)" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
                    <input ref={inputEl} onInput={startSearch} type="search" name="search" placeholder="Search" />
                </div>
            </div>
            <div className="row-2">
                <SearchList clearInput={clearInput} users={users} isRecentShown={isRecentShown} closeSearchContainer={closeSearchContainer}></SearchList>
            </div>
        </section>
    )
}