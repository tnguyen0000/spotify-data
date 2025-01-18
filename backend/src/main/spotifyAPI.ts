import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT
const CLIENT_ID = process.env.CLIENT_ID
const STATE = process.env.STATE
var redirect_uri = `http://localhost:${PORT}/callback`;