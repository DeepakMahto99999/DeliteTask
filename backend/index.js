import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './congfig/mongodb.js';
import userRouter from './routes/userRoutes.js';
import noteRouter from './routes/noteRoutes.js';

const PORT = process.env.PORT || 5000
const app = express();

app.use(express.json());
app.use(cors());
await connectDB();



app.use('/api/auth',userRouter)
app.use('/api/note',noteRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));