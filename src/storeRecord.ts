import AWS from "aws-sdk";
import { Record } from "./chartScraper";
// Set the region
AWS.config.update({ region: "eu-west-2" });
const credentials = new AWS.SharedIniFileCredentials({
  profile: "matt-dev",
});
AWS.config.credentials = credentials;

const toKebabCase = (s: string) => s.toLowerCase().replace(" ", "-");

export const uploadRecord = (record: Record, date: Date) => {
  const db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  const params: AWS.DynamoDB.PutItemInput = {
    Item: {
      id: {
        S: toKebabCase(`${record.artistID}/${date.toISOString()}/${record.position}`),
      },
      artist_id: { S: record.artistID },
      track_id: { S: record.trackID },
      artist: { S: record.artist },
      position: { N: record.position.toString() },
      track: { S: record.title },
      date: { S: date.toISOString() },
    },
    TableName: "chart-toppers",
  };
  return db.putItem(params).promise();
};
