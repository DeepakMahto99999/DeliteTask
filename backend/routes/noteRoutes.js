import express from 'express'
import middleware from '../middleware/middleware.js'
import { addNote, getNote, getSingleNote, deleteNote } from '../controllers/notesController.js' // ADDED: Import new functions

const noteRouter = express.Router()

noteRouter.post('/add-note', middleware, addNote)
noteRouter.get('/', middleware, getNote)
noteRouter.get('/:noteId', middleware, getSingleNote) // ADDED: Route for single note
noteRouter.delete('/:noteId', middleware, deleteNote) // ADDED: Route for delete note

export default noteRouter