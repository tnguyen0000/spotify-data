// Using authorisation code flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring';
import cors from 'cors';
import { getRefresh, getTokens, getUser, getTopStats } from './spotifyAPI';

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
  let scope = 'user-read-email user-library-read user-top-read playlist-read-private user-read-currently-playing';
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

// Refreshes the access token given a refresh token
app.get('/refresh', async (req: Request, res: Response): Promise<any> => {
  const refresh = req.query.refresh as string || null;
  if (!refresh) {
    return res.json('Something went wrong. Refresh token not assigned')
  }
  const tokens = await getRefresh(refresh, REDIRECT);
  return res.json(tokens);
});

// Get basic user information
app.get('/me', async (req: Request, res: Response): Promise<any> => {
  const access = req.query.access as string;
  const user = await getUser(access);
  if (user.error) {
    return res.json(user)
  }
  return res.json({
    display_name: user.display_name,
    images: user.images,
    uri: user.uri,
  });
});

// Get users top stats
app.get('/me/topStats', async (req: Request, res: Response): Promise<any> => {
  const access = req.query.access as string;
  const type = req.query.type as string;
  const topStats = await getTopStats(access, type);
  Promise.all(topStats).then((v) => {
    console.log(v)
  }).then((resolved) => {
    return res.json(resolved);
  })
});

// Starts server
const server = app.listen(PORT, () => {
  console.log(`Currently running server at ${URL}`)
});

// 
process.on('SIGINT', () => {
  server.close(() => console.log(`Closed server at ${URL}`));
});
