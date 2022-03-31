import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()
    return (
        <button className="btn btn-outline-dark"
            onClick={() => loginWithRedirect()}>
            Login
        </button>
    )
}

const LogoutButton = () => {
    const { logout } = useAuth0()
    return (
        <button className="btn btn-link"
            onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
        </button>
    )
}

const updateLogin = (api, user) => {
    const update = {
        user: user.nickname,
        email: user.email,
        picture: user.picture,
        last_access: user.updated_at
    }
    axios.post(`${api}/auth/add-update-general-user`, { update })
}

export { LoginButton, LogoutButton, updateLogin }