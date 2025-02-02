export interface Artist {
  id: string,
  name: string,
  spotifyUrl: string,
  imageUrl: string,
};

export interface ArtistShort {
  id: string,
  name: string,
  spotifyUrl: string,
};

export interface StatProps {
  id: string,
  name: string,
  artists?: ArtistShort[],
  spotifyUrl: string,
  imageUrl: string,
  type: StatType
};

export type StatType = 'artist' | 'track';