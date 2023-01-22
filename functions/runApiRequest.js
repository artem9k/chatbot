const runApiRequest = async (prompt) => {
    var res = "";
    try {
        res = await axios.post('/api/gpt', {
            prompt: prompt,
            model: "text-davinci-002"
        })
    }
    catch (error) {
        console.log(error)
    }
    if (res == null) {
        console.log("`res` is null")
        return "null"
    }
    return res.data.choices[0].text
}


export {runApiRequest}