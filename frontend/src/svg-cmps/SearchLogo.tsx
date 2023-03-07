import { useSelector } from "react-redux"
import { RootState } from "../interfaces/state"

export function SearchLogo() {
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    
    return (
        <svg className={isDarkMode ? 'dark-mode' : ''} aria-label="Search" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
    )
}