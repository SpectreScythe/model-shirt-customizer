import express from "express";
import {Configuration, OpenAIApi} from "openai";
import * as dotenv from "dotenv";
dotenv.config()

const config = new Configuration({
    organization: 'org-7PgUoEMg0OPILMGnx82T89jm',
    apiKey: process.env.API_KEY
})

const openai = new OpenAIApi(config);

const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.send('inside DALL-E')
    })
    .post(async (req, res) => {
        try {
            const {prompt} = req.body;
            const response = await openai.createImage({
                prompt,
                n: 1,
                size: '1024x1024',
                response_format: 'b64_json'
            })
            const image = response.data.data[0].b64_json;
            res.status(200).json({photo: image})
        }
        catch (e) {
            console.error(e.message)
            res.status(500).json({message: 'something went wrong'})
        }

    })

export default router