import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../interfaces/state"
import { Props } from "../interfaces/props"
import { Notification } from "../interfaces/user"

export function NotificationPreview({ notification }: Props) {
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser) navigate(-1)
    }, [])

    const dateFormat = (timestamps: number | undefined): string | undefined => {
        if (timestamps) {
            const date = new Date(timestamps)
            return date.toLocaleDateString()
        }
    }

    const dynamicItem = (notification: Notification | undefined) => {
        switch (notification?.type) {
            case 'follow':
                return checkIfFollowing(notification.by._id) ?
                    <button className="Following">Following</button> :
                    <button className="Follow">Follow</button>
            case 'like':
            case 'comment':
        }
    }

    const checkIfFollowing = (userId: string): boolean => {
        const user = loggedInUser?.following.find(user => {
            return user._id === userId
        })
        return user ? true : false
    }

    return (
        <section className="notification-preview">
            <div className="notification-info">
                <img src={notification?.by.imgUrl} alt="" />
                <p>
                    {notification?.by.username}
                    <span> {notification?.txt}.</span>
                    <span>{dateFormat(notification?.createdAt)}</span>
                </p>
            </div>
            <div className="col-2">{dynamicItem(notification)}</div>
        </section>
    )
}