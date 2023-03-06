import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";
import { LikedBy } from "../interfaces/story";
import { CloseBtn3 } from "../svg-cmps/CloseBtn3";

export function LikeList({ setIsOpenedLikeList, likeList }: Props) {
    let navigate = useNavigate();
    
    const closeModal = () => {
        if (setIsOpenedLikeList) setIsOpenedLikeList(false)
    }

    const goToProfile = (userId: string) => {
        closeModal()
        navigate(`/profile/${userId}`)
    }

    return (
        <>
            <div onClick={closeModal} className="opacity-wrapper"></div>
            <section className="like-list-modal">
                <div className="header">
                    <h2>Likes</h2>
                    <div onClick={closeModal}>
                        <CloseBtn3></CloseBtn3>
                    </div>
                </div>
                <div className="like-list-scroll">
                    {likeList?.map((item: LikedBy) => {
                        return <div className="item-preview">
                            <div onClick={() => goToProfile(item._id)} className="user-info">
                                <img src={item.imgUrl} alt="" />
                                <div>
                                    <p>{item.username}</p>
                                    <span>{item.fullname}</span>
                                </div>
                            </div>
                            <button>Follow</button>
                        </div>
                    })}
                </div>
            </section>
        </>
    )
}