import express from 'express'
import middleware from '../middleware/middleware.js'
import { addNote } from '../controllers/notesController.js'

const noteRouter = express.Router()

noteRouter.post('/add-note', middleware, addNote)

export default noteRouter