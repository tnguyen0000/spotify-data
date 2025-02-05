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
};

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
};

/** Retrieves user data
 * 
 * @param access - Access token
 * 
 * @returns https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile 
 */
export async function getUser(access: string) {
  let user = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access
    }
  });
  if (!user.ok) {
    console.log(`Failed user request: ${user.status} ${user.statusText}`)
  };
  return user.json();
};

/**
 * 
 * @param access - Access token
 * @param type - 'artists' | 'tracks'
 * 
 * @returns Promise form Spotify API
 */
export async function getTopStats(access: string, type: string) {
  // TODO!: Add mongo integration so dont have to query spotify API several times
  const timeRanges = ['short_term', 'medium_term', 'long_term'];
  const topStats: Response[] = [];
  const limitStr = 'limit=50';
  for (const timeRange of timeRanges) {
    const timeStr = `time_range=${timeRange}`;
    const urlStr = 'https://api.spotify.com/v1/me/top/' + type + '?' + limitStr + '&' + timeStr;
    const request = await fetch(urlStr, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access
      }
    });
    topStats.push(request);
  };
  return topStats;
};

/**
 * 
 * @param access - Access token
 * 
 * @returns Promise form Spotify API
 */
export async function getPlaylists(access: string) {
  // TODO!: Add mongo integration so dont have to query spotify API several times
  // TODO?: Maybe add offset for people with more than 50 playlists
  const limitStr = 'limit=50';
  const url = 'https://api.spotify.com/v1/me/playlists' + '?' + limitStr
  const playlists = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access
    }
  });
  if (!playlists.ok) {
    console.log(`Failed retrieving playlists request: ${playlists.status} ${playlists.statusText}`);
    return playlists.json();
  };
  return playlists.json();
};