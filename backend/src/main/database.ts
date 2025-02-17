import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import crpyto from 'crypto';
dotenv.config();

const MONGO_DB = process.env.MONGO_DB;
const SALT = process.env.SALT_PATTERN;

const connectionUrl = `mongodb://mongodb:27017/`;

const OPTIONS = {
  upsert: true,
};

const TOPSTATS_COLL: string = 'topStats';
const PLAYLISTSTATS_COLL: string = 'playlistStats';
const EXPIRE_TIME: number = 600; // 10 mins

// Basic encryption
// Although tokens should only exist in MongoDB for 10 mins and data inside isn't sensitive, would minimise risk of someone stealing access tokens from the database.
// Just in case even if stealing the tokens would provide no avenue of attack as the app's scope only allows retrieving music information from the Spotify API.
function getCrypt(id: String): String {
  const key = crpyto.scryptSync(id as BinaryType, SALT as BinaryType, 20).toString('hex');

  return key
}

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
      this.db = this.client.db(MONGO_DB);
      this.db.createCollection(TOPSTATS_COLL);
      this.db.createCollection(PLAYLISTSTATS_COLL);
      const TTLIndex = {
        'createdAt': 1
      };
      const TTLValue = {
        expireAfterSeconds: EXPIRE_TIME
      };
      this.db.collection(TOPSTATS_COLL).createIndex(TTLIndex, TTLValue);
      this.db.collection(PLAYLISTSTATS_COLL).createIndex(TTLIndex, TTLValue);
      
    } catch (err) {
      console.error('Could not connect to MongoDB' + err);
    }
  }

  async close() {
    try {
      this.client.close();
    } catch (err) {
      console.error('Could not close connection to MongoDB' + err);
    }
  }

  public async retrieveTopStats(id: string, type: string) {
    try {
      if (type !== 'artists' && type !== 'tracks') {
        throw new Error('Not of type \'artist\' or \'track\'');
      }
      const coll = this.db.collection(TOPSTATS_COLL);
      const realId = getCrypt(id);
      const query: any = {
        _id: realId
      }
      const found = await coll.findOne(query);
      if (found == null) {
        throw new Error('No such user on MongoDB found');
      }
      if (found[type]) {
        return found[type];
      } else {
        throw new Error('Type not found in DB yet');
      }
    } catch (err) {
      throw new Error('Failed to retrieve top stats:\n->\t' + err);
    }
  }

  public insertTopStats(id: string, type: string, stats: any) {
    try {
      if (type !== 'artists' && type !== 'tracks') {
        throw new Error('Not of type \'artist\' or \'track\'');
      }
      let coll = this.db.collection(TOPSTATS_COLL);
      const realId = getCrypt(id);
      const query: any = {
        _id: realId
      }
      const found = coll.findOne(query);
      found.then((f) => {
        if (f == null) {
          // Creates the initial document
          const ins: any = {
            _id: realId,
            createdAt: new Date(),
          }
          ins[type] = stats;
          this.db.collection(TOPSTATS_COLL).insertOne(ins);
        } else {
          // Updates existing document to include the missing field. E.g. if document had artists, this will add the tracks property and vice versa.
          const setObj: any = {};
          setObj[type] = stats;
          const update = {
            $set: setObj
          }
          coll.updateOne(
            query,
            update,
            OPTIONS
          );
        }
      });
    } catch (err) {
      console.error('MongoDB Error:', err);
      throw new Error('Failed to insert top stats:\n->\t' + err);
    }
  }
};

export default DatabaseHandler;