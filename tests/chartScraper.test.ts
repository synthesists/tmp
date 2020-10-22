import { getTop100SinglesForDate, getSpotifyArtistObject, getSpotifyTrackObject } from "../src/chartScraper";

describe("getTop100SinglesForDate", () => {
  it("should get top 100 singles", async () => {
    const chartData = await getTop100SinglesForDate(2013, 4, 20);

    expect(chartData).toEqual({});
  });
});
describe("getSpotifyArtistObject", () => {
  it("should get artist object from spotify", async () => {
    const artistObject = await getSpotifyArtistObject("ADELE");

    expect(artistObject).toEqual({});
  });
  it("should get multiple artist object from spotify", async () => {
    const artistObject = await getSpotifyArtistObject("HEADIE ONE/AJ TRACEY/STORMZY");

    expect(artistObject).toEqual({});
  });
  it("should get track object from spotify", async () => {
    const trackObject = await getSpotifyTrackObject("AIN'T IT DIFFERENT");

    expect(trackObject).toEqual({});
  });
});
