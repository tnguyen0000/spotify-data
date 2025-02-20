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
    console.error(`Failed access request: ${tokens.status} ${tokens.statusText}`)
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
    console.error(`Failed refresh request: ${tokens.status} ${tokens.statusText}`)
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
    console.error(`Failed user request: ${user.status} ${user.statusText}`)
  };
  return user.json();
};

/**
 * 
 * @param access - Access token
 * @param type - 'artists' | 'tracks'
 * 
 * @returns Array of Spotify Responses
 */
export async function getTopStats(access: string, type: string) {
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
 * @returns Promise from Spotify API which hopefully resolves to list of user's playlists
 */
export async function getPlaylists(access: string) {
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
    console.error(`Failed retrieving playlists request: ${playlists.status} ${playlists.statusText}`);
    return playlists.json();
  };
  return playlists.json();
};

/**
 * 
 * @param access - Access token
 * @param playlistId - Id of the user's playlist
 * 
 * @returns Array of Spotify's PlaylistTrackObject from a particular playlist
 */
export async function getPlaylistItems(access: string, playlistId: string) {
  const limit = 50;
  const limitStr = `limit=${limit}`;
  const initialUrl = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks?' + limitStr
  const start = await fetch(initialUrl, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access
    }
  });
  if (!start.ok) {
    console.error(`Failed retrieving initial playlist request: ${start.status} ${start.statusText}`);
    return start.json();
  };

  const startBody = await start.json();
  const res: any[] = [startBody]

  let offset = 50;
  while (offset < startBody.total) {
    const offsetStr = `offset=${offset}`;
    const url = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks?' + limitStr + '&' + offsetStr;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access
      }
    });
    if (!response.ok) {
      console.error(`Failed subsequent playlist request: ${response.status} ${response.statusText}`);
      return response.json();
    };

    const responseResolved = await response.json();
    res.push(responseResolved)
  
    offset += limit;
  }

  return res;
};

/**
 * 
 * @param access - Access token
 * @param artistIds - Array of artist ids
 * 
 * @returns Array of promises that hopefully resolve ArtistObjects
 */
export async function getArtistsDetails(access: string, artistIds: string[]) {
  let curr = 0;
  let offset = 50;
  const res: Map<string, string[]> = new Map();
  while (curr < artistIds.length) {
    const artistIdsStr = `?ids=${artistIds.slice(curr, curr + offset).toString()}`;
    const url = 'https://api.spotify.com/v1/artists' + artistIdsStr;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access
      }
    });
    if (!response.ok) {
      console.error(`Failed fetching artist details: ${response.status} ${response.statusText}`);
      return response.json();
    };
    const responseResolved = await response.json();
    responseResolved.artists.map((a: any) => {
      res.set(a.id, a.genres);
    });
    curr += offset;
  }

  
  return res;
};