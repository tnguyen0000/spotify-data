// Picks the right convert method for the Spotify object
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

// Converts Spotify's full artist object to my format
function convertArtistLong(obj: any) {
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

// Converts Spotify's track object to my format
function convertTrack(obj: any) {

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

// Converts Spotify's short artist object to my format
function convertArtistShort(obj: any) {
  return {
    id: obj.id,
    name: obj.name,
    spotifyUrl: obj.uri,
  }
}

// Converts an array of Spotify Track/Artist objects to an array of my format
export function convertTopStats(statArr: any[]) {
  const res: any[] = [];
  for (const obj of statArr) {
    if (obj.error) {
      res.push(obj);
    } else {
      const mapped = obj.items.map((x: any) => convertGeneric(x));
      res.push(mapped)
    }
  }


  return res;
}