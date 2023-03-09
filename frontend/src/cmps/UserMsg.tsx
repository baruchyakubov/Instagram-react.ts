import { useEffect, useState } from "react"
import { eventBus } from "../services/event-bus.service"
interface Msg {
    txt: string
    type: string
}

export function UserMsg() {
    const [isOpen, setIsopen] = useState(false)
    const [msg, setMsg] = useState<Msg>()

    useEffect(() => {
        eventBus.on('show-msg', (msg: Msg) => {
            setMsg(msg)
            setIsopen(true)
            setTimeout(() => setIsopen(false), 5000)
        })
    }, [])

    if (!isOpen) return <div></div>
    return (
        <div className="user-msg">
            <p>{msg?.txt}</p>
        </div>
    )
}