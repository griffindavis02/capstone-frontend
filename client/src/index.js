import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain='https://griffindavis02.us.auth0.com'
            clientId='N8WIuRr18oXawFdFQ0nLblPVzhuNMo9A'
            redirectUri={window.location.origin}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
