import { SyntheticEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { Props } from "../interfaces/props"
import { INITIAL_STATE, RootState } from "../interfaces/state"
import { login, signup } from "../store/actions/user.actions"
import { CloseBtn2 } from "../svg-cmps/CloseBtn2"
import { InstagramLogo } from "../svg-cmps/InstagramLogo"
import { UploadUserImg } from "./UploadUserImg"

export function LoginPage({ setIsLogin }: Props) {
    const [userCreds, setUserCreds] = useState({ username: '', password: '', fullname: '', imgUrl: '' })
    const [imgUrl, setImgUrl] = useState('')
    const [isSignup, setIsSignUp] = useState(false)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)

    useEffect(() => {
        if (setIsLogin && loggedInUser?._id) setIsLogin(false)
    }, [loggedInUser])

    useEffect(() => {
        setUserCreds({ ...userCreds, imgUrl })
    }, [imgUrl])

    const handleChange = (ev: SyntheticEvent): void => {
        let target = ev.target as HTMLTextAreaElement
        const field = target.name
        let value = target.value
        setUserCreds({ ...userCreds, [field]: value })
    }

    const Login = (): void => {
        dispatch(login(userCreds))
    }

    const Signup = (): void => {
        let imgUrl = userCreds.imgUrl ? userCreds.imgUrl : 'https://res.cloudinary.com/dgvpl7cdq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1678393640/bvlgm7dzj4tzeruw9vi6.png'
        dispatch(signup({...userCreds , imgUrl}))
    }

    return (
        <>
            <div onClick={() => { if (setIsLogin) setIsLogin(false) }} className="close-login">
                <CloseBtn2></CloseBtn2>
            </div>
            <form>
                <InstagramLogo></InstagramLogo>
                <input onInput={handleChange} className="username" type="text" name="username" placeholder="Username" />
                {isSignup && <input onInput={handleChange} className="fullname" type="text" name="fullname" placeholder="Fullname" />}
                <input onInput={handleChange} className="password" type="password" name="password" placeholder="Password" />
                {isSignup && <UploadUserImg imgUrl={imgUrl} setImgUrl={setImgUrl}></UploadUserImg>}
                {!isSignup && <p>Don't have an account? <span onClick={() => setIsSignUp(true)}>Sign up</span></p>}
                {isSignup && <p>Already have an account? <span onClick={() => setIsSignUp(false)}>Log in</span></p>}
                {!isSignup && <button type="button" onClick={Login}>Log in</button>}
                {isSignup && <button type="button" onClick={Signup}>Sign up</button>}
            </form>
        </>
    )
}