import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_ID = process.env.SECRET_ID;
const STATE = process.env.STATE;

// Gets initial access tokens
export async function getTokens(code: string, redirect: string) {
  let requestBody = {
    code: code,
    redirect_uri: redirect,
    grant_type: 'authorization_code'
  };
  let tokens = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // @ts-expect-error
      'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + SECRET_ID).toString('base64'))
    },
    body: new URLSearchParams(requestBody)
  })

  if (!tokens.ok) {
    console.log(`Failed access request: ${tokens.status} ${tokens.statusText}`)
  };
  return tokens.json();
}

// Gets access token from refresh token
export async function getRefresh(refresh: string, redirect: string) {
  let requestBody = {
    refresh_token: refresh,
    redirect_uri: redirect,
    grant_type: 'refresh_token'
  };
  let tokens = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // @ts-expect-error
      'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + SECRET_ID).toString('base64'))
    },
    body: new URLSearchParams(requestBody)
  })

  if (!tokens.ok) {
    console.log(`Failed refresh request: ${tokens.status} ${tokens.statusText}`)
  };
  return tokens.json();
}

// Retrieves user data
export async function getUser(access: string) {
  let user = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': 'Bearer ' + access
    }
  });
  if (!user.ok) {
    console.log(`Failed user request: ${user.status} ${user.statusText}`)
  };
  return user.json();
}