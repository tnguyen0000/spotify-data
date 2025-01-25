import { apiCallBody } from "./apiHelpers";

export async function getUserData(setUser: Function, token: string) {
  const access = `?access=${token}`
  let user = await apiCallBody('GET', '/me' + access);
  setUser(user);
  localStorage.setItem('userData', JSON.stringify(user));
};

export async function getTopStats(setUser: Function, token: string) {
  const access = `?access=${token}`
  let user = await apiCallBody('GET', '/me' + access);
  setUser(user);
  localStorage.setItem('userData', JSON.stringify(user));
};