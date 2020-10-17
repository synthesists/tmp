import { getTop100SinglesForDate } from "../src/chartScraper";

describe("getTop100SinglesForDate", () => {
  it("should get top 100 singles", async () => {
    const chartData = await getTop100SinglesForDate(2013, 4, 20);

    expect(chartData).toEqual({});
  });
});
