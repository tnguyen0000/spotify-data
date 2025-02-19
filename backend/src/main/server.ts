// Using authorisation code flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import querystring from 'querystring';
import cors from 'cors';
import { getRefresh, getTokens, getUser, getTopStats, getPlaylists, getPlaylistItems, getArtistsDetails } from './spotifyAPI';
import { convertTopStats, countArtists, countGenres, filterOwnedPlaylist, getArtistIds, getPopularSongs, getReleaseYears } from './utils';
import DatabaseHandler from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const PORT_FRONT = process.env.PORT_FRONT;
const CLIENT_ID = process.env.CLIENT_ID;
const STATE = process.env.STATE;
const URL = `http://localhost:${PORT}`;
const REDIRECT = `http://localhost:${PORT_FRONT}/dashboard`;

const MONGO = new DatabaseHandler(); 

app.use(cors())

// Testing route
app.get('/print', (req: Request, res: Response): any => {
  if (req.query.echo === undefined) {
    return res.json('Was undefined');
  }
  console.log('Test!')
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
    user_id: user.id,
    display_name: user.display_name,
    images: user.images,
    uri: user.uri,
  });
});

/**
 * Get users top stats
 * Returns array which contains either:
 *
 *  [
 *    time_range: 'short_term' | 'medium_term' | 'long_term'
 *    items: [{
 *      id: string,
 *      name: string,
 *      spotifyUrl: string,
 *      imageUrl: string,
 *      artists?: artists[]
 *      type: 'track' | 'artist'
 *    }], 
 *                    OR
 *    {
 *      time_range: 'short_term' | 'medium_term' | 'long_term'
 *      error: {
 *        status: number,
 *        message: string,
 *      }
 *    }
 *  ]
 */

app.get('/me/topStats', async (req: Request, res: Response): Promise<any> => {
  const access = req.query.access as string;
  const type = req.query.type as string;
  
  try {
    const result = await MONGO.retrieveTopStats(access, type);
    return res.json(result);
  } catch (err) {
    console.error('MongoDB Error:', err);
  }
  const topStats = await getTopStats(access, type);
  const promises = topStats.map((r) => r.json());
  const resolvedPromises = await Promise.all(promises);
  const resolved = convertTopStats(resolvedPromises);

  try {
    MONGO.insertTopStats(access, type, resolved);
  } catch (err) {
    console.error('MongoDB Error:', err);
  }

  return res.json(resolved);
});

/**
 * Get list of current user's own playlists
 * Returns either array of Spotify's SimplifiedPlaylistObject or a Spotify Error object
 */
app.get('/me/listPlaylists', async (req: Request, res: Response): Promise<any> => {
  const access = req.query.access as string;
  const userId = req.query.userId as string;
  if (!userId) {
    return res.json({
      error: 'Invalid userId',
      error_description: 'User ID provided cannot be recognised'
    });
  }

  const playlists = await getPlaylists(access);
  if (playlists.error) {
    return res.json(playlists);
  }

  return res.json(filterOwnedPlaylist(playlists.items, userId));
});

/**
 * Get all the tracks and the relevant stats from a given playlist
 * Returns either array of top X relevant stats or a Spotify Error object
 */
app.get('/me/getPlaylistStat', async (req: Request, res: Response): Promise<any> => {
  const access = req.query.access as string;
  const playlistId = req.query.playlistId as string;
  const statType = req.query.statType as string;
  if (!playlistId) {
    return res.json({
      error: 'No playlist ID provided.',
      error_description: 'No playlist ID provided'
    });
  }
  const statTypes = ['fav_artist', 'fav_genre', 'fav_year', 'popularity'];

  if (!statType || !statTypes.includes(statType)) {
    return res.json({
      error: 'Invalid stat type provided.',
      error_description: 'Stat type is either empty or does not match one of the provided types.'
    });
  }

  try {
    const result = await MONGO.retrievePlaylistStats(playlistId, statType);
    return res.json(result);
  } catch (err) {
    console.error('MongoDB Error:', err);
  }

  const playlistItems = await getPlaylistItems(access, playlistId);
  if (!playlistItems.length && playlistItems.error) {
    return res.json(playlistItems);
  }
  
  let stats = [];
  switch (statType) {
    case 'fav_artist':
      stats = countArtists(playlistItems);
      break;
    case 'fav_genre':
      const artistIds = getArtistIds(playlistItems);
      // TODO?: This step could be made for efficient by only querying unique artist ids and then looping through the playlist items
      // rather than getting all artists (including duplicates) and then querying them from Spotify API.
      // As most time spent loading is from querying the data rather than the processing.
      const artistDetails = await getArtistsDetails(access, artistIds);
      if (artistDetails.error) {
        return res.json(artistDetails);
      }
      stats = countGenres(artistDetails);
      break;
    case 'fav_year':
      stats = getReleaseYears(playlistItems);
      break;
    case 'popularity':
      stats = getPopularSongs(playlistItems);
      break;
    default:
      break;
  }

  try {
    MONGO.insertPlaylistStats(playlistId, statType, stats);
  } catch (err) {
    console.error('MongoDB Error:', err);
  }
  
  return res.json(stats);
});

// Starts server
const server = app.listen(PORT, () => {
  console.log(`Currently running server at ${URL}`)
});

// 
process.on('SIGINT', () => {
  MONGO.close();
  server.close(() => console.log(`Closed server at ${URL}`));
});
