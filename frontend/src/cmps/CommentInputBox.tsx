export function CommentInputBox() {
    const handleInput = (ev: React.FormEvent<HTMLInputElement>): void => {
        const target = ev.target as any
    }

    return (
        <form onSubmit={() => console.log} className="comment-box">
            <input onInput={handleInput} className="comment-input" type="text" placeholder="Add a comment" />
            <p>Post</p>
        </form>
    )
}