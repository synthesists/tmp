import axios from "axios";
import cheerio from "cheerio";

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
  artist: string;
};

export type Chart = {
  records: Record[];
  date: Date;
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

  const records: Record[] = [];
  const titleArtists = cheerio.load(data)(".title-artist");

  titleArtists.each((position, titleArtist) => {
    const title = titleArtist.children[1].children[1].firstChild.data as string;
    const artist = titleArtist.children[3].children[1].firstChild.data as string;
    records.push({ title, artist, position: position + 1 });
  });

  return { records, date: new Date(year, month, day) };
};
