import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{tyep: String, require: true},
    name:{tyep: String, require: true},
    email:{tyep: String, require: true},
    image:{tyep: String, require: true},
})

const User = mongoose.model('User',userSchema)

export default User;