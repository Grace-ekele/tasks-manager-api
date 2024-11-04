const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema( 
    {
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowerCase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error('email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new error('Age must be a postive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlengh: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password') ){
                throw new error('not safe')
            }
            
        }
    },

    tokens:[{
        token :{
            type:String,
            required:true
        }
    }],

    avater: {
        type: Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avater

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id:user._id.toString()}, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}


userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('incorrect password')
    }

    return user
}

//hash the plain pasword before saving

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,10)
    }
    next()
})

//delete user tasks when user is removed

userSchema.pre('deleteOne',{ document: true, query: false }, async function (next) {
    const user = this 
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema )

module.exports = User