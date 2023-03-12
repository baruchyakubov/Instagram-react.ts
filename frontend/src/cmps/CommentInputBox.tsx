import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Props } from "../interfaces/props"
import { RootState } from "../interfaces/state"
import { showErrorMsg } from "../services/event-bus.service"

export function CommentInputBox({ AddUserComment }: Props) {
    const [comment, setComment] = useState('')
    const inputEl3 = useRef<HTMLInputElement>(null);
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)

    const handleInput = (ev: React.FormEvent<HTMLInputElement>): void => {
        const target = ev.target as any
        setComment(target.value)
    }

    const addComment = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        if (!loggedInUser)
            showErrorMsg('Login required')
        else if (!comment)
            showErrorMsg('Add text')
        else if (AddUserComment) {
            AddUserComment(comment)
            clearInput()
        }
    }

    const clearInput = (): void => {
        if (inputEl3.current) inputEl3.current.value = ''
    }

    return (
        <form onSubmit={addComment} className="comment-box">
            <input ref={inputEl3} onInput={handleInput} className="comment-input" type="text" placeholder="Add a comment" />
            <button><p>Post</p></button>
        </form>
    )
}