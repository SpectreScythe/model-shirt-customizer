import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from 'cors';
import dallERoute from "./routes/dalle.routes.js";
import stableDiffusion from "./routes/stable.diffusion.js";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({limit: "50mb"}))

app.get('/', (req, res) => {
    res.status(200).send('Hello from DALL-E')
})

app.use('/api/v1/dall-e', dallERoute)
app.use('/api/v1/stable-diffusion', stableDiffusion)

app.listen(5000)

