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
import { eventBus } from "../services/event-bus.service";

export function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const params = useParams()
    let navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const storys = useSelector((state: RootState) => state.storyModule.storys)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)

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

    useEffect(() => {
        if (loggedInUser?._id !== user?._id) return
        setUser(loggedInUser)
    }, [loggedInUser])


    const loadUser = async (): Promise<void> => {
        const userId = params.userId
        if (userId) {
            const User = (loggedInUser?._id === userId) ? loggedInUser : await userService.getById(userId)
            if (User) {
                setUser(User)
                dispatch(setFilterBy({ userId: User._id }))
                dispatch(loadStorys())
            }
        }
    }

    const openUserListModal = (title: string): void => {
        const userList = (title === 'Followers') ? user?.followers : user?.following
        eventBus.emit('openUserListModal', { userList, title })
    }

    const goToDetails = (storyId: string, idx: number): void => {
        navigate(`/profile/${user?._id}/details/${storyId}/${idx}`)
    }

    if (!user || !storys) return <div className="loader"></div>

    return (
        <>
            <section className={`profile-page ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="profile-header">
                    <img src={user.imgUrl} alt="" />
                    <div className="user-info">
                        <h1>{user.username}</h1>
                        <div className="activity-data">
                            <p><span>{storys.length}</span> posts</p>
                            <p onClick={() => openUserListModal('Followers')}><span>{user.followers.length}</span> followers</p>
                            <p onClick={() => openUserListModal('Following')}><span>{user.following.length}</span> following</p>
                        </div>
                        <p className="fullname">{user.fullname}</p>
                    </div>
                </div>
                <div className="activity-data-mobile">
                    <p><span>{storys.length}</span> <span>posts</span></p>
                    <p onClick={() => openUserListModal('Followers')}><span>{user.followers.length}</span> <span> followers</span></p>
                    <p onClick={() => openUserListModal('Following')}><span>{user.following.length}</span> <span> following</span></p>
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