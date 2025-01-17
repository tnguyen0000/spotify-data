// Cannot safely store client secret so using PKCE flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import dotenv from 'dotenv';
import { generateRandomString, sha256, base64encode } from './PKCEHashes';

dotenv.config();

const PORT = process.env.PORT
const CLIENT_ID = process.env.CLIENT_ID
const STATE = process.env.STATE

export const getUserAuth = async () => {
  const codeVerifier  = generateRandomString(64); 
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  window.localStorage.setItem('code_verifier', codeVerifier);

  const redirectUri = `http://localhost:${PORT}`;

  const scope = 'user-read-private user-read-email';
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  const params =  {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state: STATE,
  }

  // @ts-expect-error
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  window.localStorage.setItem('code', code as string)
}

export const getAccessToken = async () => {
  let codeVerifier = localStorage.getItem('code_verifier');

  const redirectUri = `http://localhost:${PORT}`;
  const code = localStorage.getItem('code');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // @ts-expect-error
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch('https://api.spotify.com/api/token', payload);
  const response =await body.json();

  localStorage.setItem('access_token', response.access_token);
}