import { SyntheticEvent, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, logout, setFilterBy } from "../store/actions/user.actions";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";
import { eventBus } from "../services/event-bus.service";

export function FollowersSuggestions({ Users }: Props) {
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    let navigate = useNavigate();

    useEffect(() => {
        dispatch(setFilterBy({ txt: '', limit: 5 }))
        dispatch(getUsers())
    }, [])

    const goToProfile = (userId: string | undefined): void => {
        navigate(`/profile/${userId}`)
    }

    const Logoot = (ev: SyntheticEvent): void => {
        ev.stopPropagation()
        dispatch(logout())
    }

    const checkIfFollowing = (userId: string): boolean => {
        const user = loggedInUser?.following.find(user => {
            return user._id === userId
        })
        return user ? true : false
    }

    const updateFollowStatus = (updatedStatus: string, userId: string) => {
        eventBus.emit('updateFollowStatus', { updatedStatus, userId })
    }

    return (
        <section className={`followers-suggestions ${isDarkMode ? 'dark-mode' : ''}`}>
            <div onClick={() => goToProfile(loggedInUser?._id)} className="curr-user">
                <div className="col-1">
                    {loggedInUser?._id ?
                        <img src={loggedInUser?.imgUrl} alt="" /> :
                        isDarkMode ? <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1678393640/bvlgm7dzj4tzeruw9vi6.png" alt="" /> :
                            <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/v1677966828/ajwihd1ezvwiezqi4p2y.png" alt="" />}
                    <div className="user-info">
                        {loggedInUser?._id ?
                            <p>{loggedInUser.username}</p> :
                            <p>Log in</p>}
                        {loggedInUser?._id && <span>{loggedInUser.fullname}</span>}
                    </div>
                </div>
                {loggedInUser?._id && <span onClick={Logoot} className="logout">Logout</span>}
            </div>
            <p className="Suggestions">Suggestions for you</p>
            {Users?.map(user => {
                if (user._id === '63727d458a7f36b53eb8ee30') return
                return <div key={user._id} className="user-preview">
                    <div onClick={() => goToProfile(user._id)} className="col-1">
                        <img src={user.imgUrl} alt="" />
                        <div className="user-info">
                            <p>{user.username}</p>
                        </div>
                    </div>
                    {(loggedInUser && checkIfFollowing(user._id)) ?
                        <span onClick={() => updateFollowStatus('Follow', user._id)} className="following-btn">Following</span> :
                        <span onClick={() => updateFollowStatus('Following', user._id)} className="follow-btn">Follow</span>}
                </div>
            })}
        </section>
    )
}