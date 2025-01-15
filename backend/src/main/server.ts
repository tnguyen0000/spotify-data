import express, { Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Stub for retrieving data
app.get('/get_data', (req: Request, res: Response) => {
  // TODO!: Fill MongoDB with spotify data
});

// Starts server
const server = app.listen(port, () => {
  console.log(`Currently running server at http://localhost:${port}`)
});

// 
process.on('SIGINT', () => {
  server.close(() => console.log(`Closed server at http://localhost:${port}`));
});
