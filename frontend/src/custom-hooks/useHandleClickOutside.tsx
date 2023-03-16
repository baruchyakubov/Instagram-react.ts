import { useEffect } from "react"

export const useHandleClickOutside = (ref: React.RefObject<HTMLInputElement>, cb: Function) => {

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            let target = event.target as HTMLTextAreaElement
            if (ref.current && !ref.current.contains(target)) {
                cb()
                document.removeEventListener('click', listener, true);
            }
        }
        document.addEventListener('click', listener, true);
        return () => {
            document.removeEventListener('click', listener, true);
        }
    }, [ref, cb])
}