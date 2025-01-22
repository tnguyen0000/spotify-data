import { apiCallBody } from "./apiHelpers";

// Function gets the initial access token.
export async function getToken(setToken: Function, code: string, state: string) {
  const codeStr = `?code=${code}`
  const stateStr = `?state=${state}`
  let tokens = await apiCallBody('GET', '/callback' + codeStr + '&' + stateStr, undefined);
  if (!tokens.error) {
    setToken(tokens.access_token);
    localStorage.setItem('access_token', tokens.access_token);
    let currDateTime = new Date();
    currDateTime.setSeconds(currDateTime.getSeconds() + tokens.expires_in)
    localStorage.setItem('access_token_expire', currDateTime.getTime().toString());
    localStorage.setItem('refresh_token', tokens.refresh_token);
  } else {
      // TODO!: Add proper error handling to frontend webpage
      console.log('Something went wrong with getting token', tokens);
  }
};

// Function refreshes the access token.
export async function getRefresh(setToken: Function, refresh: string) {
  const refreshStr = `?refresh=${refresh}`
  let tokens = await apiCallBody('GET', '/refresh' + refreshStr, undefined);
  if (!tokens.error) {
    setToken(tokens.access_token);
    localStorage.setItem('access_token', tokens.access_token);
    let currDateTime = new Date();
    currDateTime.setSeconds(currDateTime.getSeconds() + tokens.expires_in)
    localStorage.setItem('access_token_expire', currDateTime.getTime().toString());
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  } else {
      console.log('Something went wrong with refreshing', tokens);
  }
};