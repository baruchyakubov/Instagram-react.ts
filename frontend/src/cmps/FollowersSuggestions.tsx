import { SyntheticEvent, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, logout, setFilterBy } from "../store/actions/user.actions";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";
import { User } from "../interfaces/user";
import { useCheckIfFollowing } from "../custom-hooks/useCheckIfFollowing";

export function FollowersSuggestions({ Users, UpdateFollowStatus }: Props) {
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    let navigate = useNavigate();
    const checkIfFollowing = (userId: string) => useCheckIfFollowing(userId , loggedInUser)

    const goToProfile = (userId: string | undefined): void => {
        if (!loggedInUser) return
        navigate(`/profile/${userId}`)
    }

    const Logoot = (ev: SyntheticEvent): void => {
        ev.stopPropagation()
        dispatch(logout())
    }

    const dynamicItem = (user: User) => {
        if (!checkIfFollowing) return
        if (loggedInUser?._id === user._id) return
        if (loggedInUser && checkIfFollowing(user._id)) {
            return <span onClick={() => { if (UpdateFollowStatus) UpdateFollowStatus('Follow', user._id, user.username) }} className="following-btn">Following</span>
        } else {
            return <span onClick={() => { if (UpdateFollowStatus) UpdateFollowStatus('Following', user._id, user.username) }} className="follow-btn">Follow</span>
        }
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
                return <div key={user._id} className="user-preview">
                    <div onClick={() => goToProfile(user._id)} className="col-1">
                        <img src={user.imgUrl} alt="" />
                        <div className="user-info">
                            <p>{user.username}</p>
                        </div>
                    </div>
                    <div className="dynamic-item">{dynamicItem(user)}</div>
                </div>
            })}
        </section>
    )
}