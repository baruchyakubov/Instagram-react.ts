import { SyntheticEvent, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, logout } from "../store/actions/user.actions";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";

export function FollowersSuggestions({ Users }: Props) {
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    const goToProfile = (userId: string | undefined) => {
        navigate(`/profile/${userId}`)
    }

    const Logoot = (ev: SyntheticEvent) => {
        ev.stopPropagation()
        dispatch(logout())
    }

    return (
        <section className="followers-suggestions">
            <div onClick={() => goToProfile(loggedInUser?._id)} className="curr-user">
                <div className="col-1">
                    {loggedInUser?._id ? <img src={loggedInUser?.imgUrl} alt="" /> : <img src="../../public/img/user.png" alt="" />}
                    <div className="user-info">
                        {loggedInUser?._id ? <p>{loggedInUser.username}</p> : <p>Log in</p>}
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
                    <span className="follow-btn">Follow</span>
                </div>
            })}
        </section>
    )
}