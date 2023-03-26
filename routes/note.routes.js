const express = require("express")
const noteRouter = express.Router()
const { NoteModel } = require("../model/note.model")
const jwt = require("jsonwebtoken")

noteRouter.get("/",async (req, res) => {
    const token=req.headers.authorization
    const decoded= jwt.verify(token,"masai")
    try{
        if(decoded){
            const note = await NoteModel.find({"userId":decoded.userId})
            res.status(200).send(note)
        }   
    }catch(e){
        res.status(400).send({"msg":e.message})
    }
})

noteRouter.post("/add", async (req, res) => {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"New Note Added"})
    }catch(e){
        res.status(400).send({"msg":e.message})
    }
})

noteRouter.patch("/update/:noteId", async(req, res) => {
    const  payload = req.body
    const noteId=req.params.noteId
    try{
        await NoteModel.findByIdAndUpdate({_id:noteId},payload)
        res.status(200).send({"msg":"Note has been Updated"})
    }catch(e){
        res.status(400).send({"msg":e.message})
    }
})

noteRouter.delete("/delete/:noteId", async(req, res) => {
    const  payload = req.body
    const noteId = req.params.noteId
    const token=req.headers.authorization
    const decoded= jwt.verify(token,"masai")
    const req_id = decoded.userId //The person making delete req
    const note=NoteModel.findOne({_id:noteId})
    const userId_in_note=note.userId
    try{
        if(req_id===userId_in_note){
            await NoteModel.findByIdAndDelete({_id:noteId})
            res.status(200).send({"msg":"Note has been Deleted"})
        }else{
            res.status(400).send({"msg":"Not Authorised"})
        }
        
    }catch(e){
        res.status(400).send({"msg":e.message})
    }
})

module.exports = { noteRouter }