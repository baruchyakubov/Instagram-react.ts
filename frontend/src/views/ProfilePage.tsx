import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { SavedPosts, User } from "../interfaces/user";
import { userService } from "../services/user.service";
import { StorysLogo } from "../svg-cmps/storysLogo";
import { SavedLogo } from "../svg-cmps/SavedLogo";
import { loadStorys, resetStorys, setFilterBy } from "../store/actions/story.actions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { eventBus } from "../services/event-bus.service";
import { Props } from "../interfaces/props";
import { logout } from "../store/actions/user.actions";
import { useCheckIfFollowing } from "../custom-hooks/useCheckIfFollowing";

export function ProfilePage({ UpdateFollowStatus }: Props) {
    const [user, setUser] = useState<User | null>(null)
    const [isActive, setIsActive] = useState<string>('posts')
    const [savedStorys, setSavedStorys] = useState<SavedPosts[]>([])
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
        if (loggedInUser) setSavedStorys(loggedInUser.savedPosts)
    }, [loggedInUser])

    const loadUser = async (): Promise<void> => {
        const userId = params.userId
        if (userId) {
            const User = (loggedInUser?._id === userId) ? loggedInUser : await userService.getById(userId)
            if (User) {
                setUser(User)
                dispatch(setFilterBy({ userId: User._id }))
                dispatch(loadStorys())
                if (loggedInUser)
                    setSavedStorys(loggedInUser.savedPosts)
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

    const changeStatus = (status: string): void => {
        if (isActive !== status)
            setIsActive(status)
    }

    const checkIfFollowing = (userId: string) => useCheckIfFollowing(userId , loggedInUser)

    const Logout = () => {
        dispatch(logout())
        navigate('/')
    }

    const dynamicItem = () => {
        if(loggedInUser?._id === user?._id){
            return <button onClick={Logout} className="logout">Logout</button>
        }
        if (!checkIfFollowing) return
        if (!user) return
        if (loggedInUser && checkIfFollowing(user._id)) {
            return <button onClick={() => { if (UpdateFollowStatus) UpdateFollowStatus('Follow', user._id, user.username) }} className="Following">Following</button>
        } else {
            return <button onClick={() => { if (UpdateFollowStatus) UpdateFollowStatus('Following', user._id, user.username) }} className="Follow">Follow</button>
        }
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
                        <div>{dynamicItem()}</div>
                    </div>
                </div>
                <div className="activity-data-mobile">
                    <p><span>{storys.length}</span> <span>posts</span></p>
                    <p onClick={() => openUserListModal('Followers')}><span>{user.followers.length}</span> <span> followers</span></p>
                    <p onClick={() => openUserListModal('Following')}><span>{user.following.length}</span> <span> following</span></p>
                </div>
                <div className="active-btns">
                    <div onClick={() => changeStatus('posts')} className={`posts ${(isActive === 'posts') ? 'active' : ''}`}>
                        <StorysLogo></StorysLogo>
                        <p>POSTS</p>
                    </div>
                    {(loggedInUser?._id === user._id) && <div onClick={() => changeStatus('saved')} className={`saved ${(isActive === 'saved') ? 'active' : ''}`}>
                        <SavedLogo></SavedLogo>
                        <p>SAVED</p>
                    </div>}
                </div>
                {(isActive === 'posts') && <div className="profile-post-list">
                    {
                        storys.map((story, idx) => {
                            return <img onClick={() => goToDetails(story._id, idx)} key={story._id} src={story.imgUrls[0]} alt="" />
                        })
                    }
                </div>}
                {((loggedInUser?._id === user._id) && isActive === 'saved') && <div className="profile-post-list">
                    {
                        savedStorys.map((story, idx) => {
                            return <img onClick={() => goToDetails(story._id, idx)} key={story._id} src={story.imgUrl} alt="" />
                        })
                    }
                </div>}

            </section>
            <Outlet></Outlet>
        </>
    )
}