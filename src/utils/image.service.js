const crudOps = require("../services/crud-service");

class ImageService {
    constructor() {
        this.coll_name = process.env.imgBucket ; 
    }
    
    async read(database, query) {
        return await crudOps.readDoc(database, this.coll_name, query)
    }
     async create(database, doc) {
        return await crudOps.createDoc(database, this.coll_name, doc);
    }
   async update(database, query, doc) {
        return await crudOps.updateOneDoc(database, this.coll_name, query, doc);
    }
}
module.exports = new ImageService();