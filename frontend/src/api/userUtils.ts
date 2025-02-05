import { apiCallBody } from "./apiHelpers";

export async function getUserData(setUser: Function, token: string) {
  const access = `?access=${token}`
  let user = await apiCallBody('GET', '/me' + access);
  setUser(user);
  localStorage.setItem('userData', JSON.stringify(user));
};

export async function getTopStats(token: string, type: string) {
  const access = `?access=${token}`;
  const typeStr = `type=${type}`;
  const url = '/me/topStats' + access + '&' + typeStr;
  let topInfoData = await apiCallBody('GET', url);
  
  return topInfoData;
};

export async function getPlaylists(token: string, userId: string) {
  const access = `?access=${token}`;
  const userIdStr = `userId=${userId}`
  const url = '/me/listPlaylists' + access + '&' + userIdStr
  let playlists = await apiCallBody('GET', url);
  
  return playlists;
};