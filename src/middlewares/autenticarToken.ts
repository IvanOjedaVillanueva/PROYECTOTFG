import jwt from 'jsonwebtoken'

const auth = (req: any, res: any, next: Function) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token?.includes("Bearer "))
        token = token?.slice(7, token.length) 
    if (!token) { 
        res.status(401).json({ error: "you dont have a token" })
    }
    else {
        if (typeof (token) === 'string') 
            jwt.verify(token, String(process.env.JWTKEY), (err, decod) => { 
                if (err)
                    res.status(401).json({ msg: "Token is invalid or expired" })
                else if (typeof (decod) !== 'string') {
                    req.uid = decod?.uid
                    next()
                }
            })
    }
}

export default auth