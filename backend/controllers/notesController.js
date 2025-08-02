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

export const getNote = async (req, res) => {
    try {
        const notes = await noteModel.find({ userId: req.userId })
        return res.status(200).json({ success: true, notes })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Can't retrieve notes" })
    }
}

// ADDED: Get single note by ID
export const getSingleNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        
        // Find note by ID and ensure it belongs to the authenticated user
        const note = await noteModel.findOne({ 
            _id: noteId, 
            userId: req.userId 
        });

        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found or you don't have permission to view it" 
            });
        }

        return res.status(200).json({ success: true, note });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Error retrieving note" 
        });
    }
}

// ADDED: Delete note by ID
export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        
        // Find and delete note only if it belongs to the authenticated user
        const deletedNote = await noteModel.findOneAndDelete({ 
            _id: noteId, 
            userId: req.userId 
        });

        if (!deletedNote) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found or you don't have permission to delete it" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Note deleted successfully" 
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Error deleting note" 
        });
    }
}