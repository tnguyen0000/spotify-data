// Using authorisation code flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring';
import cors from 'cors';
import { getTokens } from './spotifyAPI';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const PORT_FRONT = process.env.PORT_FRONT;
const CLIENT_ID = process.env.CLIENT_ID;
const STATE = process.env.STATE;
const URL = `http://localhost:${PORT}`;
const REDIRECT = `http://localhost:${PORT_FRONT}/dashboard`;

app.use(cors())

// Testing route
app.get('/print', (req: Request, res: Response): any => {
  if (req.query.echo === undefined) {
    return res.json('Was undefined');
  }
  const data = req.query.echo as string;
  return res.json(data);

});

// Get user authorisation
app.get('/get_auth', (req: Request, res: Response): any => {
  let scope = 'user-read-private user-read-email';
  return res.json('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT,
      state: STATE
    }));
});

// Gets access token for the first time
app.get('/callback', async (req: Request, res: Response): Promise<any> => {
  let code = req.query.code as string || null;
  // TODO!: implement state check : let state = req.query.state || null;
  if (!code) {
    return res.json('Something went wrong. Code not assigned')
  }
  const tokens = await getTokens(code, REDIRECT);
  return res.json(tokens);
});

// Stub for retrieving data
app.get('/get_data', (req: Request, res: Response) => {
  // TODO!: Fill MongoDB with spotify data
});

// Starts server
const server = app.listen(PORT, () => {
  console.log(`Currently running server at ${URL}`)
});

// 
process.on('SIGINT', () => {
  server.close(() => console.log(`Closed server at ${URL}`));
});
