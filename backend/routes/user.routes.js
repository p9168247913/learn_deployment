const express = require("express")
const userRouter = express.Router()
const { UserModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//register
userRouter.post("/register", async (req, res) => {
    const {name, email, password, location, age}=req.body
    try {
        bcrypt.hash(password, 5, async(err, hash) =>{
            // Store hash in your password DB.
            const user = new UserModel({name,email, password:hash, location, age})
            await user.save()
            res.status(200).send({ msg: "Registration Done!" })
        });
        // const user = new UserModel(req.body)
        // // console.log(user);
        // await user.save()
        // res.status(200).send({ msg: "Registration Done!" })
    } catch (e) {
        res.status(400).send({ "msg": e.message })
        // console.log(e);
    }
    // res.send("Registration Done Successfully")
})

//login
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        console.log(user);
        // user.length > 0 ? res.status(200).send({ msg: "Login Successfull!", "token": jwt.sign({ name: 'batman' }, 'adam')}) :
        //     res.status(400).send({ "msg": "User Not Found" })

        if(user){
            bcrypt.compare(password, user.password, (err, result) =>{
                // result == true
                if(result){
                    console.log(result)
                    res.status(200).send({ "msg": "Login Successfull!", "token": jwt.sign({ "userId": user._id }, 'masai')}) 
                }else{
                    res.status(400).send({ "msg": "User Not Found" })
                }
            });
        }
        // await user.save()
        // console.log(user);

    } catch (e) {
        res.status(400).send({ "msg": e.message })

    }
    // res.send("Login Done Successfully")
})

userRouter.get("/details", (req,res)=>{
    const token = req.headers.authorization
    jwt.verify(token, 'adam', function(err, decoded) {
        decoded? res.status(200).send("User Details"):res.status(400).send({ "msg": err.message })
    });
    
})

userRouter.get("/movieData", (req,res)=>{
    const {token} = req.query
    if(token==="abc@123"){
        res.status(200).send("User Details")
    }else{
        res.status(400).send({ "msg": "Login required, cannot access the restricted route" })
    }
})


module.exports = {
    userRouter
}