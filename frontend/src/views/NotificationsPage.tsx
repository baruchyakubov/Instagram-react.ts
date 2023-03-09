import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../interfaces/state"
import { NotificationList } from "../cmps/NotificationList"

export function NotificationsPage() {
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser) navigate(-1)
    }, [])

    if(!loggedInUser?.notifications.length) return <div>No notifications yet</div>

    return (
        <section className={`notifications-page ${isDarkMode ? 'dark-mode' : ''}`}>
            <NotificationList
                notificationList={loggedInUser?.notifications}
            />
        </section>
    )
}