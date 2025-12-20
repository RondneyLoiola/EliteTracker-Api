//Auth com GitHub
import type { Response, Request } from "express";
import axios, { isAxiosError } from 'axios'

const clientSecret = '4ccc19aec8306c0ce2cd548a08d9d85aef3717bd'
const clientId = 'Ov23liHfn4Kr5kjorjxw'

class AuthController {
    auth = async (req: Request, res: Response) => {
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`

        res.redirect(redirectUrl)
    }

    authCallback = async (req: Request, res: Response) => {

        try {
            const { code } = req.query

            const accessTokenResult = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })

            const userDataResult = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessTokenResult.data.access_token}`
                }
            })

            const { node_id: id, avatar_url: avatarUrl, name } = userDataResult.data

            return res.status(201).json({ id, avatarUrl, name })
        } catch (error) {
            if(isAxiosError(error)){
                return res.status(400).json(error.response?.data)
            }

            return res.status(500).json({message: 'Something went wrong...'})
        }
    }
}

export default AuthController