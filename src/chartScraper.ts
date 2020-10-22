import axios from "axios";
import cheerio from "cheerio";
import { getArtistID, getTrackID } from "./spotifyServices";
import asyncPool from "tiny-async-pool";

const padNumberWithLeadingZeros = (num: number, size: number) => {
  let numString = num.toString();
  while (numString.length < size) {
    numString = "0" + numString;
  }
  return numString;
};

export type Record = {
  position: number;
  title: string;
  artistID: string;
  trackID: string;
  artist: string;
};

export type Chart = {
  records: Record[];
  date: Date;
};

export type Artist = {
  artistID: string;
};

export const getSpotifyArtistObject = async (artist: string): Promise<string[]> => {
  if (artist.includes("/")) {
    const multipleArtists = artist.split("/");
    return Promise.all(multipleArtists.map((artist) => getArtistID(artist)));
  } else if (artist.includes(" FT ")) {
    const featuredArtist = artist.split(" FT ");
    return Promise.all(featuredArtist.map((artist) => getArtistID(artist)));
  } else {
    return Promise.all([getArtistID(artist)]);
  }
};

export const getSpotifyTrackObject = async (track: string): Promise<string[]> => {
  return Promise.all([getTrackID(track)]);
};

export const getTop100SinglesForDate = async (
  year: number,
  month: number,
  day: number
): Promise<Chart> => {
  const yearString = padNumberWithLeadingZeros(year, 4);
  const monthString = padNumberWithLeadingZeros(month, 2);
  const dayString = padNumberWithLeadingZeros(day, 2);
  const url = `https://www.officialcharts.com/charts/singles-chart/${yearString}${monthString}${dayString}`;

  const { data } = await axios.get(url);

  const titleArtists = cheerio.load(data)(".title-artist");

  let partialRecords: any[] = [];

  titleArtists.each(async (position, titleArtist) => {
    const title = titleArtist.children[1].children[1].firstChild.data as string;
    const artist = titleArtist.children[3].children[1].firstChild.data as string;
    partialRecords.push({ title, artist, position: position + 1 });
  });

  partialRecords = partialRecords.slice(0, 3);

  const recordArrayArray: Record[][] = await asyncPool(
    1,
    partialRecords,
    async (partialRecord: any) => {
      const artistIDs = await getSpotifyArtistObject(partialRecord.artist);
      const trackID = await getSpotifyTrackObject(partialRecord.title);
      await new Promise((res) => setTimeout(() => res(1000), 1000));
      return artistIDs.map((artistID) => ({ ...partialRecord, artistID, trackID: trackID[0] }));
    }
  );

  let records: Record[] = [];
  recordArrayArray.forEach((recordArray: Record[]) => {
    records = records.concat(recordArray);
  });

  return { records, date: new Date(year, month, day) };
};
