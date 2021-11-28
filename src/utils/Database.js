const { MongoClient } = require("mongodb");
const Config = require("../config.json");
const Log = require("./Log");

class Database {
  constructor() {
    this.client = new MongoClient(Config.mongoConnection);
  }

  async connect() {
    await this.client.connect();
    Log.Info("Database Connected.");
    this.db = this.client.db(Config.dbName);
    this.guilds = this.db.collection("guilds");
    this.documents = this.db.collection("documents");
    this.events = this.db.collection("events");
    this.threads = this.db.collection("threads");
  }
}

module.exports = new Database();
