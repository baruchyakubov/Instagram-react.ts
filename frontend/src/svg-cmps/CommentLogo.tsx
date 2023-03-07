import { useSelector } from "react-redux"
import { RootState } from "../interfaces/state"

export function CommentLogo() {
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    
    return (
        <svg className={isDarkMode ? 'dark-mode' : ''} aria-label="Comment" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
    )
}