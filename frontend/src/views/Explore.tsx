import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { loadStorys, resetStorys } from "../store/actions/story.actions"
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { useNavigate, Outlet } from 'react-router-dom'

export function Explore() {
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const storys = useSelector((state: RootState) => state.storyModule.storys)
    let navigate = useNavigate();

    useEffect(() => {
        if (storys) dispatch(resetStorys())
        dispatch(loadStorys())
    }, [])

    const goToDetails = (storyId: string, idx: number): void => {
        navigate(`/explore/details/${storyId}/${idx}`)
    }

    if (!storys) return <div className="loader"></div>
    return (
        <>
            <section className="explore-page">
                {
                    storys.map((story, idx) => {
                        return <img onClick={() => goToDetails(story._id, idx)} key={story._id} src={story.imgUrls[0]} alt="" />
                    })
                }
            </section>
            <Outlet></Outlet>
        </>
    )
}