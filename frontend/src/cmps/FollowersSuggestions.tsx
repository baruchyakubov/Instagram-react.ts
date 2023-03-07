import { SyntheticEvent, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, logout, setFilterBy } from "../store/actions/user.actions";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";

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

    return (
        <section className="followers-suggestions">
            <div onClick={() => goToProfile(loggedInUser?._id)} className="curr-user">
                <div className="col-1">
                    {loggedInUser?._id ? <img src={loggedInUser?.imgUrl} alt="" /> : <img src="https://res.cloudinary.com/dgvpl7cdq/image/upload/v1677966828/ajwihd1ezvwiezqi4p2y.png" alt="" />}
                    <div className="user-info">
                        {loggedInUser?._id ? <p className={isDarkMode ? 'dark-mode' : ''}>{loggedInUser.username}</p> : <p>Log in</p>}
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
                            <p className={isDarkMode ? 'dark-mode' : ''}>{user.username}</p>
                        </div>
                    </div>
                    {(loggedInUser && checkIfFollowing(user._id)) ? <span className="following-btn">Following</span>  : <span className="follow-btn">Follow</span>}
                </div>
            })}
        </section>
    )
}