import noteModel from "../models/noteModel.js";

export const addNote = async (req, res) => {
    try {
        const { title, description } = req.body;

        const newNote = new noteModel({
            title,
            description,
            userId: req.userId 
        })

        await newNote.save()

        return res
            .status(200)
            .json({ success: true, message: "Note Created Successfully" }) 

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Error in adding Note" })
    }
}