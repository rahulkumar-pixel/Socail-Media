import jwt from 'jsonwebtoken';
import {error} from '../Utiles/responseWapper.js';
import User from '../module/User.js';

const requireUser = async (req, res, next) => {
    if(
        !req.headers ||
        !req.headers['authorization'] ||
        !req.headers['authorization'].startsWith("Bearer")
        // !req.headers?.authorization?.startsWith('Bearer')
    ){
        // return res.status(401).send("Authorization is Required"); 
        return res.send(error(402, "Authorization is Required"))
    }
    const accessToken = req.headers['authorization'].split(" ")[1];
    try {
        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY)
        req._id = decode._id
        const user = await User.findById(req._id)
        if(!user){
            return res.send(error(404, 'user not found'))
        }
        next();
    } catch (e) {
        console.log(e);
        // return res.status(400).send("UnAuthorized")
        return res.send(error(402, "Invalied accessKey"))
    }

}
export default requireUser