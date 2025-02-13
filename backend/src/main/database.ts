import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;

const connectionUrl = `mongodb://mongodb:27017/`;

class DatabaseHandler {
  public client: MongoClient;
  public db: Db;

  constructor() {
    this.#connect();
  }

  async #connect() {
    try {
      const options = {
        serverSelectionTimeoutMS: 10000,
      }
      this.client = await MongoClient.connect(connectionUrl, options);
      this.client.db(MONGO_DB);
      
    } catch (err) {
      console.error('Could not connect to MongoDB' + err);
    }
  }

  async retrieveTopStats(type: string) {
    if (type === 'artist') {

    } else if (type === 'track') {

    } else {
      return {};
    }
  }

  

};

export default DatabaseHandler;