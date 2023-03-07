import { useSelector } from "react-redux"
import { RootState } from "../interfaces/state"

export function SaveLogo() {
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    
    return (
        <svg className={isDarkMode ? 'dark-mode' : ''} aria-label="Save" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
    )
}