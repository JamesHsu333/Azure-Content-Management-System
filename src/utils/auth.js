import * as Msal from 'msal'
import {
    tenantId,
    clientId
} from '../tenant.js'
import axios from 'axios'

const Tokenkey = "msal.idtoken"

export default class Auth {
    constructor() {

        let redirectUri = ""

        this.applicationConfig = {
            auth: {
                clientId: clientId,
                authority: "https://login.microsoftonline.com/" + tenantId,
                redirectURI: redirectUri,
                navigateToLoginRequestUrl: false
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: false
            }
        }

        this.requestObj = {
            scopes: ["user.read", "user.read.all", "user.readwrite.all", "directory.read.all", "directory.readwrite.all"]
        }

        this.app = new Msal.UserAgentApplication(this.applicationConfig)

        this.app.handleRedirectCallback((error, response) => {
            if (error) {
                alert(error)
            } else {
                alert(response.tokenType)
            }
        })
    }

    async login() {
        try {
            await this.app.loginPopup(this.requestObj)
            const user = {
                name: this.app.getAccount().name,
                account: this.app.getAccount().userName
            }
            console.log(this.app.getAccount())
            return user ? user : null
        } catch (err) {
            alert(err)
        }
    }

    logout() {
        this.app.logout()
    }

    async acquireToken() {
        try {
            const accessToken = await this.app.acquireTokenSilent(this.requestObj)
            return accessToken
        } catch (e) {
            const accessTokenAgain = await this.app
                .acquireTokenPopup(this.requestObj)
            return accessTokenAgain
        }
    }
}

export const getToken = () => {
    return localStorage.getItem(Tokenkey)
}

export const acquireAzureToken = async () => {
    const oauth2_url = 'https://ecloudture.azurewebsites.net/api/token?code=mqM1t4TQFaqZ6THZXaau1WnZ5PPRlepd7nf6ioI2Gcw1/C6R3p1PeQ==';
    let AD_REST_Response = await axios({
        method: 'post',
        url: oauth2_url
    })
    return AD_REST_Response.data
}