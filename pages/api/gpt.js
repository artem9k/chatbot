// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

    const oai_api_key = process.env.API_KEY

    const headers = new Headers()
    headers.append('Authorization', 'Bearer ' + oai_api_key) 
    headers.append('Content-Type', 'application/json')

    const prompt = "AI: Hey! I'm Feynman, a super intelligent AI designed to help humans with physics!\n\nAI: Go ahead! Ask me anything!n\nUser:What is the speed of light?\n\nAI:"

    const body = {
        'model': "text-davinci-003",
        'prompt': req.body.prompt,
        "max_tokens": 100 + req.body.prompt.length,
        "temperature": 0.7,
        "top_p": 1,
        "n": 1,
        "stream": false,
    }

    fetch('https://api.openai.com/v1/completions', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(body)
    }).then(
        (response) => {
            return response.json()
        }
    )
    .then((data) => {
        res.status(200).json(data)
    })
    .catch( (error) => {
        res.status(500).json(error)
    })

}
