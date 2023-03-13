import { useEffect } from "react"
import { StoryList } from "../cmps/StoryList"
import { FollowersSuggestions } from "../cmps/FollowersSuggestions";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { loadStorys, resetStorys } from "../store/actions/story.actions"
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { getUsers } from "../store/actions/user.actions";
import { Props } from "../interfaces/props";

export function Home({ UpdateFollowStatus }: Props) {
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const storys = useSelector((state: RootState) => state.storyModule.storys)
    const users = useSelector((state: RootState) => state.userModule.users)

    useEffect(() => {
        if (storys) dispatch(resetStorys())
        dispatch(loadStorys())
        dispatch(getUsers())
    }, [])

    if (!storys || !users) return <div className="loader"></div>
    return (
        <section className="home-page">
            <Outlet></Outlet>
            <div className="main-home">
                <StoryList storys={storys}></StoryList>
                <FollowersSuggestions UpdateFollowStatus={UpdateFollowStatus} Users={users}></FollowersSuggestions>
            </div>
        </section>
    )
}