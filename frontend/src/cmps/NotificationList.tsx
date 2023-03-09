import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../interfaces/state"
import { Props } from "../interfaces/props"
import { NotificationPreview } from "./NotificationPreview"
import { Notification } from "../interfaces/user"

export function NotificationList({ notificationList }: Props) {
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser) navigate(-1)
    }, [])

    return (
        <section className="notification-list">
            <h1>Notifications</h1>
            {notificationList?.map((notification: Notification) => {
                return <NotificationPreview
                    key={notification.id}
                    notification={notification}
                />
            })}

        </section>
    )
}