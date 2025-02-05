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
  selectedPlaylists: Array<any>,
  setSelectedPlaylists: Function,
};

export interface PlaylistContainerProps {
  playlists: any,
  selectedPlaylists: Array<any>,
  setSelectedPlaylists: Function,
}