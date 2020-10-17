import AWS from "aws-sdk";
import { Record } from "./chartScraper";
// Set the region
AWS.config.update({ region: "eu-west-2" });
const credentials = new AWS.SharedIniFileCredentials({
  profile: "personal",
});
AWS.config.credentials = credentials;

const toKebabCase = (s: string) => s.toLowerCase().replace(" ", "-");

export const uploadRecord = (record: Record, date: Date) => {
  const db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  const params: AWS.DynamoDB.PutItemInput = {
    Item: {
      artist_id: {
        S: toKebabCase(
          `${record.artist}/${date.toISOString()}/${record.position}`
        ),
      },
      artist: { S: record.artist },
      position: { N: record.position.toString() },
      track: { S: record.title },
      date: { S: date.toISOString() },
    },
    TableName: "uk-singles-history",
  };
  return db.putItem(params).promise();
};
