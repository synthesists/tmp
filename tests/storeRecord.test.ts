import { getTop100SinglesForDate, Record, Chart } from "../src/chartScraper";
import { uploadRecord } from "../src/storeRecord";

it("should push a record to db", async () => {
  const record: Record = {
    artist: "Circa Waves",
    position: 1,
    title: "Last nite",
  };

  const response = await uploadRecord(record, new Date());

  expect(response).toEqual(1);
});

it("should upload todays chart to DB", async () => {
  const todaysDate = new Date();
  const chart: Chart = await getTop100SinglesForDate(
    todaysDate.getFullYear(),
    todaysDate.getMonth(),
    todaysDate.getDate()
  );
  await Promise.all(chart.records.map((record) => uploadRecord(record, todaysDate)));
});

it("get years chart and push to db", async () => {
  const sundaysDate = new Date("October 11, 2020 12:00:00");
  await Promise.all(
    Array.from(Array(52 * 10).keys()).map(async (index) => {
      const date = new Date(new Date().setDate(sundaysDate.getDate() - 7 * index));
      const chart: Chart = await getTop100SinglesForDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      await Promise.all(chart.records.map((record) => uploadRecord(record, date)));
    })
  );
}, 999999);
