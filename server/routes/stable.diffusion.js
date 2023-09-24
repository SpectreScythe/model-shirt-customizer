import express from "express";
import * as dotenv from "dotenv";
dotenv.config()

const router = express.Router()

let body = {
    "key": process.env.API_KEY,
    "prompt": "",
    "negative_prompt": null,
    "width": "512",
    "height": "512",
    "samples": "1",
    "num_inference_steps": "20",
    "seed": null,
    "guidance_scale": 7.5,
    "safety_checker": "yes",
    "multi_lingual": "no",
    "panorama": "no",
    "self_attention": "no",
    "upscale": "no",
    "embeddings_model": null,
    "webhook": null,
    "track_id": null
}

router.route('/')
    .get((req, res) => {
        res.send('inside StableDiffusion-AI')
    })
    .post(async (req, res) => {
        try {
            const {prompt} = req.body;

            let options = {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...body,  prompt})
            };

            console.log(options.body)
            const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', options)
            const data = await response.json()
            const image = data.output[0];
            console.log(image)
            res.status(200).json({photo: image})
        }
        catch (e) {
            console.error(e.message)
            res.status(500).json({message: 'something went wrong'})
        }

    })

export default router