import User from '../module/User.js';
import bcrypt from 'bcrypt';
import jwt from'jsonwebtoken';
import { error, success } from '../Utiles/responseWapper.js';

const SignUpController = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!email || !password || !name){
            return res.send(error(404, "The field were require"))
            // return res.status(400).send('The field were require')
        }
            const oldUser = await User.findOne({ email })
        
        if(oldUser){
            // return res.status(400).send('User allready registered')
            return res.send(error(409, "User already registered"))
        }
        const HashPassword = await bcrypt.hash(password, 10)
        const users = await User.create({
            name,
            email,
            password: HashPassword
        }) 
        // return res.status(201).send({
        //     user,
        // })
        return res.send(success(201, 'User created successfully'))
    } catch (e) {
       return res.send(error(500, e.message))
    }

}

const loginController = async (req, res) => {
    try {
       const {email, password} = req.body;
       if(!email || !password){
        // return res.status(400).send("All field required")
        return res.send(error(400, "All field required"))
       }
       const user = await User.findOne({email}).select('+password')
       if(!user){
        // return res.status(403).send("User not found")
        return res.send(error(409, "User not found"))
       }
       const matched = await bcrypt.compare(password, user.password)
       if(!matched){
        // return res.status(403).send("Password incorrect")
        return res.send(error(403, "Password incorrect"))
       }
       const accessToken = generatingTheAccessToken({ 
        _id: user._id,
        })
       const refreshToken = generatingTheRefreshToken({ 
        _id: user._id,
        })
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })
    //    return res.send({accessToken})
        return res.send(success(201, {
            accessToken,
        }))
    } catch (e) { return res.send(error(500, e.message))}
};
// this will check the refreshToken valid or not and also genetrate new accessTokon
const GeneratingRefreshTokenController = (req, res) => {
    const cookies = req.cookies;

    if(!cookies.jwt){
        // return res.status(401).send("refresh token in cookies is required")
        return res.send(error(401, "refresh token in cookies is required"))
    }
    const refreshToken = cookies.jwt;
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)
        const _id = decode._id;
        const accessToken = generatingTheAccessToken({_id})
        // return res.status(201).json({accessToken})
        return res.send(success(201, {
            accessToken,
        }))
    }catch (e) {
         return res.send(error(500, e.message))
        
    }
}

const logOutController = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true
        } )
        return res.send(success(201, 'user logged out'))
    } catch (e) {
         return res.send(error(500, e.message))
    }
}

// Token Generation 
const generatingTheAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1d"
        })
        console.log(token);
        return token;
    } catch (e) {
        console.log(e);
    }
}
const generatingTheRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y"
        })
        console.log(token);
        return token;
    } catch (e) {
        console.log(e);
    }
}
export default {
    SignUpController,
    loginController,
    GeneratingRefreshTokenController,
    logOutController
}