// Using authorisation code flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring'

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const PORT_FRONT = process.env.PORT_FRONT;
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_ID = process.env.SECRET_ID;
const STATE = process.env.STATE;
const URL = `http://localhost:${PORT}`;
const REDIRECT = `http://localhost:${PORT_FRONT}/dashboard`;

// Testing route
app.get('/print', (req: Request, res: Response): any => {
  if (req.query.echo === undefined) {
    return res.json('Was undefined');
  }
  const data = req.query.echo as string;
  return res.json(data);

});

// Get user authorisation
app.get('/get_auth', (req: Request, res: Response) => {
  let scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT,
      state: STATE
    }));
});

app.get('/callback', function(req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        // @ts-expect-error
        'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + SECRET_ID).toString('base64'))
      },
      json: true
    };
  }
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
