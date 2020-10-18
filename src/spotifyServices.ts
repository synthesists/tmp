import rp from "request-promise";
import spotifyCredentials from "./config/config";
import axios from "axios";

export type Artist = {
  artistID: string;
};

let token: any;

const validToken = (): boolean => token && token.expiration > new Date().getTime();

const updateToken = async (): Promise<void> => {
  const buffer = Buffer.from(
    `${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`,
    "utf-8"
  );

  const options = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "client_credentials",
    },
    json: true,
    headers: {
      Authorization: `Basic ${buffer.toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {},
  };
  const response = await rp(options);
  token = {
    id: response.access_token,
    expiration: new Date().getTime() + response.expires_in * 1000,
  };
};

const getTokenId = async (): Promise<string> => {
  if (!validToken()) await updateToken();
  return token.id;
};

export const getArtist = async (artist: string): Promise<string> => {
  const tokenID = await getTokenId();
  const options = {
    url: `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${tokenID}`,
    },
    json: true,
  };
  const response = await axios(options);
  // console.log(response.data.artists.items[0].id);
  return response.data.artists.items[0].id;
};
