import express, { Request, Response} from 'express';
import dotenv from 'dotenv';
import { getAccessToken, getUserAuth } from './spotifyAPI';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Get access token
app.get('/get_token', (req: Request, res: Response) => {
  getUserAuth().then(() => {
    getAccessToken()
  })
});

// Print token
app.get('/print', (req: Request, res: Response) => {
  const access_token = localStorage.getItem('access_token');
  console.log(access_token)
});

// Stub for retrieving data
app.get('/get_data', (req: Request, res: Response) => {
  // TODO!: Fill MongoDB with spotify data
});

// Starts server
const server = app.listen(PORT, () => {
  console.log(`Currently running server at http://localhost:${PORT}`)
});

// 
process.on('SIGINT', () => {
  server.close(() => console.log(`Closed server at http://localhost:${PORT}`));
});
