import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { User } from "../interfaces/user";
import { userService } from "../services/user.service";
import { StorysLogo } from "../svg-cmps/storysLogo";
import { SavedLogo } from "../svg-cmps/SavedLogo";
import { loadStorys, resetStorys, setFilterBy } from "../store/actions/story.actions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const params = useParams()
    let navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const storys = useSelector((state: RootState) => state.storyModule.storys)

    useEffect(() => {
        if (storys) dispatch(resetStorys())
        loadUser()
        return () => {
            dispatch(setFilterBy({ userId: user?._id }))
        }
    }, [])

    useEffect(() => {
        loadUser()
    }, [params.userId])


    const loadUser = async () => {
        const userId = params.userId
        if (userId) {
            const User = await userService.getById(userId)
            if (User) {
                setUser(User)
                dispatch(setFilterBy({ userId: User._id }))
                dispatch(loadStorys())
            }
        }
    }

    const goToDetails = (storyId: string, idx: number) => {
        navigate(`/profile/${user?._id}/details/${storyId}/${idx}`)
    }

    if (!user || !storys) return <div className="loader"></div>

    return (
        <>
            <section className="profile-page">
                <div className="profile-header">
                    <img src={user.imgUrl} alt="" />
                    <div className="user-info">
                        <h1>{user.username}</h1>
                        <div className="activity-data">
                            <p><span>{storys.length}</span> posts</p>
                            <p><span>{user.followers.length}</span> followers</p>
                            <p><span>{user.following.length}</span> following</p>
                        </div>
                        <p className="fullname">{user.fullname}</p>
                    </div>
                </div>
                <div className="activity-data-mobile">
                    <p><span>2</span> <span>posts</span></p>
                    <p><span>184</span> <span>followers</span></p>
                    <p><span>171</span> <span>following</span></p>
                </div>
                <div className="active-btns">
                    <div className="posts">
                        <StorysLogo></StorysLogo>
                        <p>POSTS</p>
                    </div>
                    <div className="saved">
                        <SavedLogo></SavedLogo>
                        <p>SAVED</p>
                    </div>
                </div>
                <div className="profile-post-list">
                    {
                        storys.map((story, idx) => {
                            return <img onClick={() => goToDetails(story._id, idx)} key={story._id} src={story.imgUrls[0]} alt="" />
                        })
                    }
                </div>
            </section>
            <Outlet></Outlet>
        </>
    )
}