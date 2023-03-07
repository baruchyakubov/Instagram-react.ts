import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";
import { RootState } from "../interfaces/state";
import { LikedBy } from "../interfaces/story";
import { User } from "../interfaces/user";
import { CloseBtn3 } from "../svg-cmps/CloseBtn3";

export function UserListModal({ setIsOpenedLikeList, likeList, title }: Props) {
    let navigate = useNavigate();
    const loggedInUser = useSelector((state: RootState): (User | null) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    const closeModal = (): void => {
        if (setIsOpenedLikeList) setIsOpenedLikeList(false)
    }

    const goToProfile = (userId: string): void => {
        closeModal()
        navigate(`/profile/${userId}`)
    }

    const checkIfFollowing = (userId: string): boolean => {
        const user = loggedInUser?.following.find(user => {
            return user._id === userId
        })
        return user ? true : false
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
                        return <div className="item-preview">
                            <div onClick={() => goToProfile(item._id)} className={`user-info ${isDarkMode ? 'dark-mode' : ''}`}>
                                <img src={item.imgUrl} alt="" />
                                <div>
                                    <p>{item.username}</p>
                                    <span>{item.fullname}</span>
                                </div>
                            </div>
                            {(loggedInUser && checkIfFollowing(item._id)) ? <button className="Following">Following</button> : <button className="Follow">Follow</button>}

                        </div>
                    })}
                </div>
            </section>
        </>
    )
}