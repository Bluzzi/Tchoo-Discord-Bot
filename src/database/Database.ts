import { MongoClient } from "mongodb";
import { mongodb } from "../../resources/json/secret.json";

const client = new MongoClient(`mongodb://${mongodb.host}:${mongodb.port}`);

client.connect();

const database = client.db(mongodb.db);
export default database;