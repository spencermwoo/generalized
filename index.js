const express = require('express')
const { Configuration, OpenAIApi } = require("openai");

require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express()
const port = 3000

URL_PATH = 'localhost:3000'

html_snippet = `
<!doctype html>
<html>
<head><title>Generalized API</title></head>
<body>
  <h1>`

prompt = `Create an HTML document with content on ${URL_PATH}.  In a separate section also add relative links to related topics

` + html_snippet;

app.get('/', (req, res) => {
  html_home = `Welcome to the Generalized API</h1>
<p>This site is a one-stop-shop for all your information needs.  We have information on <a href="/health">health</a>, <a href="/finance">finance</a>, <a href="/technology">technology</a>, <a href="/sports">sports</a>, and more</p>`;

  res.send(html_snippet + html_home)
})

app.get('*', async (req, res) => {
  const CUR_PATH = req.originalUrl.slice(1)

  const {data} = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt.replaceAll(URL_PATH, CUR_PATH),
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(data.choices)

  res.send(html_snippet + data.choices[0].text)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})