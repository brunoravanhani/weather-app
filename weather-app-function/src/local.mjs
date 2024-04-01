import express from 'express';
import {lambdaHandler} from './app.mjs';

const app = express();

const port = 3000;

app.get('/', async (req, res) => {
    const result = await lambdaHandler({}, {});
    res.send(JSON.stringify(result))
});

app.listen(port, () => {
    console.log(`Server Started: http://localhost:${port}`);
})