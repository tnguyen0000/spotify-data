/** Picks the right convert method for the Spotify object
 * 
 * @param obj Should correspond to Spotify API's full artist OR track object 
 * 
 * @returns 
 */
function convertGeneric(obj: any) {
  switch (obj.type) {
    case "artist":
      return convertArtistLong(obj);
    case "track":
      return convertTrack(obj);
    default:
      // Should be unreachable unless Spotify changes their API response.
      break;
  }
}

/** Converts Spotify's full artist object to my format
 * 
 * @param obj Should correspond to Spotify API's full artist object 
 * 
 * @returns 
 */
function convertArtistLong(obj: any): Object {
  let image = '';
  if (obj.images.length > 0) {
    image = obj.images[0].url;
  }
  return {
    id: obj.id,
    name: obj.name,
    spotifyUrl: obj.uri,
    imageUrl: image,
    type: obj.type,
  }
}
 
/** Converts Spotify's track object to my format
 * @param obj Should correspond to Spotify API's full track object 
 * 
 * @returns 
 */
function convertTrack(obj: any): Object {
  let image = '';
  const album = obj.album;
  if (album.images.length > 0) {
    image = album.images[0].url;
  }

  return {
    id: obj.id,
    name: obj.name,
    spotifyUrl: obj.uri,
    imageUrl: image,
    artists: obj.artists.map((a: any) => convertArtistShort(a)),
    type: obj.type,
  }
}

/** Converts Spotify's short artist object to my format
 * 
 * @param obj Should correspond to Spotify API's shortened artist object 
 * 
 * @returns 
 */
function convertArtistShort(obj: any): Object {
  return {
    id: obj.id,
    name: obj.name,
    spotifyUrl: obj.uri,
  }
}

/** Converts an array of Spotify Track/Artist objects to an array of my format
 * @param statArr Array of Spotify API's full artist/track object 
 * 
 * @returns Array of my own formated artist/track objects
 */
export function convertTopStats(statArr: any[]): any[] {
  const res: any[] = [];
  const timeRanges = ['short_term', 'medium_term', 'long_term'];
  // timeRanges length and statArr length should correspond with eachother
  for (let i = 0; i < statArr.length; i++) {
    const obj = statArr[i];
    if (obj.error) {
      const resObj = {
        time_range: timeRanges[i],
        error: obj.error
      }
      res.push(resObj);
    } else {
      const mapped = obj.items.map((x: any) => convertGeneric(x));
      const resObj = {
        time_range: timeRanges[i],
        items: mapped
      }
      res.push(resObj)
    }
  }

  return res;
}

/** Filters an array of Spotify's SimplifiedPlaylistObject so that it returns only Playlists owned/created by current user
 * @param playlists Array of Spotify API's SimplifiedPlaylistObject 
 * @param userId Current user's id
 * 
 * @returns Filtered array of SimplifiedPlaylistObject
 */
export function filterOwnedPlaylist(playlists: any[], userId: string): any[] {
  return playlists.filter((p) => p.owner.id == userId);
}