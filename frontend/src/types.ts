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
};

export interface SetOptionProps {
  setOption: Function,
};

export interface PlayListCardProps {
  id: string,
  name: string,
  imageUrl: string,
  selectedPlaylist: string,
  setSelectedPlaylist: Function,
  setSelectedPlaylistName: Function,
};

export interface PlaylistContainerProps {
  playlists: any,
  selectedPlaylist: string,
  setSelectedPlaylist: Function,
  setSelectedPlaylistName: Function,
}

export interface PlaylistStatContainerProps {
  stats: any,
  statName: string,
  playlistName: string
}
export interface StatNamesObject {
  'fav_artist': string,
  'fav_genre': string,
  'fav_year': string,
  'popularity': string
};