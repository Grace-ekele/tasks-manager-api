const express =require('express')
 require('dotenv').config()
const router = express.Router()
const User= require('../model/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')



router.post('/users', async (req,res)=> {
    const user = new User(req.body)
     try {
         await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

        
     } catch (error) {
         res.status(400).send(error)
     }
 
 
})

router.post('/users/login', async (req,res) =>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send ({user, token})
    } catch (error) {
        res.status(400).send()
        
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async(req, res)=>{

    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).save()
    }
})
 
router.get('/users/me', auth ,async (req,res)=>{
 
     res.send(req.user)
})


const upload = multer({

    limit:{
        fileSize:1000000
    },

    fileFilter( req, file, cb ){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload an image'))
        }
        cb(undefined,true)
    }
})


router.post ('/users/me/avater', auth, upload.single('avater'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avater = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

 
router.patch('/users/me', auth, async (req,res)=>{
 
     const updates = Object.keys(req.body)
     const allowUpdate = ["name","emeil", "password", "age"]
     const isValid =updates.every((update)=>{
         return allowUpdate.includes(update)
     })
     if(!isValid){
         return res.status(400).send({error:"invalid updates!"})
     }
     try{

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
 
         res.send(req.user)
 
     } catch (error){
         res.status(500).send(error)
     }
})

router.delete('/users/me', auth, async (req,res)=>{
     try{
         await req.user.deleteOne()
         res.send(req.user)
     }catch(error){
         res.status(500).send()
     }
})


router.delete('/users/me/avater', auth, async (req,res)=>{
    try{
        req.user.avater = undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

router.get('/users.:id/avater', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id) 
        if (!user || user.avater) {
            throw new Error()
        }  

        res.set('Content-Type', 'image/jpg')
        res.send(user.avater)
     } catch (e){
        res.status(404).send()
    }
})


module.exports = router