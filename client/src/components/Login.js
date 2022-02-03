import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()
    return (
        <button className="btn btn-primary btn-lg mt-5"
            onClick={() => loginWithRedirect()}>
            Login
        </button>
    )
}

const LogoutButton = () => {
    const { logout } = useAuth0()
    return (
        <button className="btn btn-primary btn-lg mt-5"
            onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
        </button>
    )
}

export default LoginButton
export { LogoutButton }