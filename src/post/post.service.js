const crudOps = require("../services/crud-service");

class postService {
    constructor() {
        this.coll_name = "post"; 
    }
    async create(database, doc) {
        return await crudOps.createDoc(database, this.coll_name, doc);
    }
    async read(database, query,options) {
        return await crudOps.readDoc(database, this.coll_name, query,options)
    }
    async readpost(database, query, pageNo, options){
        return await crudOps.readByProjection(database,query, pageNo, options);
    }
   async count(database,query){
    return await crudOps.countDocuments(database,this.coll_name,query)
   }
   async readWithPagination(database, query, req,limit, skip) {    
    return await crudOps.readDocWithPagination(database, this.coll_name, query, req,limit, skip)
}
   async update(database, query, doc) {
        return await crudOps.updateOneDoc(database, this.coll_name, query, doc);
    }
   async countDocuments(database, query) {
        return await crudOps.countDocuments(database, this.coll_name, query);
    }
    async addReply(database, postId, replyBody){
          return await crudOps.addReply(database, this.coll_name, postId, replyBody);
    }
}
module.exports = new postService();