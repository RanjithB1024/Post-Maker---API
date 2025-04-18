const { MongoClient } = require('mongodb');
require('dotenv').config();

class MongoLoader {
  constructor() {
    this.client = new MongoClient(process.env.DB_HOSTNAME, { useUnifiedTopology: true });
    this.db = null;
  }

  async init() {
    try {
      await this.client.connect();
      console.log("****", process.env.DB_HOSTNAME, process.env.DB_NAME);
      const chalk = await import('chalk');
      console.info(chalk.default.green('We are connected!'));

      this.db = this.client.db(process.env.DB_NAME);
      const dbStats = await this.db.stats();
      const freeSpaceBytes = dbStats.storageSize - dbStats.dataSize;
      const freeSpaceMB = freeSpaceBytes / (1024 * 1024); 
      console.log(`Free space available in the database: ${freeSpaceMB.toFixed(2)} MB`);
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error; 
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }
}

module.exports = new MongoLoader();
