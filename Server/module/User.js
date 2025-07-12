import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true, 
        lowercase: true,
    },
    password : {
        type: String,
        required: true,
        select : false
    },
    name : {
        type: String,
        required: true
    },
    bio : {
        type: String
    },
    avatar : {
        publicId : String,
        url: String
    },
    followers: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    followings: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }],
    posts: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'post'
    }]
}
)

const User = mongoose.model('user', UserSchema)
export default User;