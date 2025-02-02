import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;

const connectionUrl = `mongodb://localhost:27017/`;

class DatabaseHandler {
  public client: MongoClient;
  public db: Db;

  constructor() {
    this.#connect();
  }

  async #connect() {
    try {
      this.client = await MongoClient.connect(connectionUrl);
      console.log(this.client);
      this.client.db(MONGO_DB);
    } catch (err) {
      console.error(err);
    }
  }

  

};

export default DatabaseHandler;