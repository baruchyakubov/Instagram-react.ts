import { SyntheticEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { Props } from "../interfaces/props"
import { INITIAL_STATE, RootState } from "../interfaces/state"
import { RecentSearchs } from "../interfaces/user"
import { updateUser } from "../store/actions/user.actions"
import { CloseBtn3 } from "../svg-cmps/CloseBtn3"

export function SearchList({ closeSearchContainer, isRecentShown, users, clearInput }: Props) {
    const [recentSearchs, setRecentSearchs] = useState<RecentSearchs[]>([])
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const navigate = useNavigate()

    useEffect(() => {
        getLoggedInUser()
    }, [loggedInUser])

    const getLoggedInUser = async () => {
        if (!loggedInUser?._id) {
            setRecentSearchs([])
            return
        }
        if (loggedInUser?.recentSearchs) {
            setRecentSearchs(loggedInUser.recentSearchs)
        }
    }

    const goToProfile = (item: RecentSearchs) => {
        if (clearInput) clearInput()
        if (loggedInUser?._id) {
            const user = { ...loggedInUser }
            const Item = user.recentSearchs.find(i => {
                return item._id === i._id
            })
            if (!Item) {
                const recentSearch = {
                    _id: item._id,
                    username: item.username,
                    fullname: item.fullname,
                    imgUrl: item.imgUrl,
                }
                user.recentSearchs.unshift(recentSearch)
                dispatch(updateUser(user))
            }
        }
        navigate(`/profile/${item._id}`)
        if (closeSearchContainer) closeSearchContainer()
    }

    const deleteRecentSearch = (ev: SyntheticEvent, item: RecentSearchs) => {
        ev.stopPropagation()
        if (loggedInUser?._id) {
            const user = { ...loggedInUser }
            const itemIdx = user.recentSearchs.findIndex(i => {
                return item._id === i._id
            })
            user.recentSearchs.splice(itemIdx, 1)
            dispatch(updateUser(user))
        }
    }

    return (
        <section className="search-list-container">
            {isRecentShown && <p className="recent">Recent</p>}
            {(!recentSearchs.length && isRecentShown) && <p className="no-recent">No recent searchs</p>}
            {(!users?.length && !isRecentShown) && <p className="no-results">No results found</p>}
            {(recentSearchs.length !== 0 && isRecentShown) && <section className="recent-searchs">
                {recentSearchs.map(item => {
                    return <div onClick={() => goToProfile(item)} className="search-item recent-item" key={item._id}>
                        <div className="user-info">
                            <img src={item.imgUrl} alt="" />
                            <div>
                                <p>{item.username}</p>
                                <span>{item.fullname}</span>
                            </div>
                        </div>
                        <div onClick={(ev) => deleteRecentSearch(ev, item)} className="close-btn">
                            <CloseBtn3></CloseBtn3>
                        </div>
                    </div>
                })}
            </section>}
            {!isRecentShown && <section className="search-list">
                {users?.map(item => {
                    return <div onClick={() => goToProfile(item)} className="search-item recent-item" key={item._id}>
                        <div className="user-info">
                            <img src={item.imgUrl} alt="" />
                            <div>
                                <p>{item.username}</p>
                                <span>{item.fullname}</span>
                            </div>
                        </div>
                    </div>
                })}
            </section>}
        </section>
    )
}

