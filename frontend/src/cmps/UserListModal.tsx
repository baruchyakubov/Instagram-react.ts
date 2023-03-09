import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Props } from "../interfaces/props";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { LikedBy } from "../interfaces/story";
import { User } from "../interfaces/user";
import { CloseBtn3 } from "../svg-cmps/CloseBtn3";

export function UserListModal({ setIsOpenedLikeList, UpdateFollowStatus, checkIfFollowing, likeList, title }: Props) {
    let navigate = useNavigate();
    const loggedInUser = useSelector((state: RootState): (User | null) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

    const closeModal = (): void => {
        if (setIsOpenedLikeList) setIsOpenedLikeList(false)
    }

    const goToProfile = (userId: string): void => {
        closeModal()
        navigate(`/profile/${userId}`)
    }
    
    return (
        <>
            <div onClick={closeModal} className="opacity-wrapper"></div>
            <section className={`like-list-modal ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className={`header ${isDarkMode ? 'dark-mode' : ''}`}>
                    <h2>{title}</h2>
                    <div onClick={closeModal}>
                        <CloseBtn3></CloseBtn3>
                    </div>
                </div>
                <div className="like-list-scroll">
                    {likeList?.map((item: LikedBy) => {
                        return <div key={item._id} className="item-preview">
                            <div onClick={() => goToProfile(item._id)} className={`user-info ${isDarkMode ? 'dark-mode' : ''}`}>
                                <img src={item.imgUrl} alt="" />
                                <div>
                                    <p>{item.username}</p>
                                    <span>{item.fullname}</span>
                                </div>
                            </div>
                            {(loggedInUser && checkIfFollowing) && checkIfFollowing(item._id) ?
                                <button onClick={() => { if (UpdateFollowStatus) UpdateFollowStatus('Follow', item._id) }} className="Following">Following</button> :
                                <button onClick={() => { if (UpdateFollowStatus) UpdateFollowStatus('Following', item._id) }} className="Follow">Follow</button>}

                        </div>
                    })}
                </div>
            </section>
        </>
    )
}