const { ObjectId } = require("mongodb");
const constants = require("../constants/Constants");

class CRUDOperations {
  constructor() {}
  async createDoc(database, coll_name, doc) {
    const collection = database.collection(coll_name);
    const options = { ordered: true };
    try {
      if (doc.length > constants.NUMBERS.ONE) {
        return await collection.insertMany(doc, options);
      }
      return await collection.insertOne(doc);
    } catch (e) {
      return e;
    }
  }
  async readDoc(database, coll_name, query, options, skip, limit) {
    const collection = database.collection(coll_name);
    try {
      if (options) {
        return await collection
          .find(query)
          .sort(options.sort)
          .skip(skip ? skip : constants.NUMBERS.ZERO)
          .limit(limit ? limit : constants.NUMBERS.ZERO)
          .toArray();
      } else {
        return await collection
          .find(query)
          .skip(skip ? skip : constants.NUMBERS.ZERO)
          .limit(limit ? limit : constants.NUMBERS.ZERO)
          .toArray();
      }
    } catch (e) {
      return e;
    }
  }
  async readByProjection(database, coll_name, query, options) {
    let prjAfr = {};
    let prjBfr = {};
    prjBfr["_id"] = { $toString: "$_id" };
    let skip,
      cPage,
      currentPage,
      totalPages,
      counter,
      limit = constants.NUMBERS.LIMIT;
    cPage = query.pageNo;
    if (!cPage || cPage == constants.NUMBERS.ZERO) {
      cPage = constants.NUMBERS.ONE;
    }
    currentPage = typeof cPage == "string" ? Number(cPage) : cPage;
    skip = limit * currentPage - limit;
    const collection = database.collection(coll_name);
    counter = await collection
      .aggregate([
        {
          $match: query,
        },
        {
          $count: "count",
        },
      ])
      .toArray();
    if (counter[0] !== undefined) {
      totalPages = Math.ceil(counter[0].count / limit);
      const collection = database.collection(coll_name);
      try {
        if (pageNo && pageNo.isdropdown && pageNo.isdropdown == "true") {
          let docsResult = await collection
            .aggregate([
              {
                $match: query,
              },
            ])
            .sort(options.sort)
            .toArray();
          return { docsResult };
        } else {
          let docsResult = await collection
            .aggregate([
              {
                $match: query,
              },
            ])
            .sort(options.sort)
            .skip(skip ? skip : constants.NUMBERS.ZERO)
            .limit(limit ? limit : constants.NUMBERS.ZERO)
            .toArray();
          let totalNoOfRecords =
            counter[0] !== undefined ? counter[0].count : constants.NUMBERS.ZERO;
          return {
            docsResult,
            totalPages,
            currentPage,
            limit,
            totalNoOfRecords,
          };
        }
      } catch (e) {
        return e;
      }
    }
  }


async readDocWithPagination(database, coll_name, query, limit, skip) {  
  const collection = database.collection(coll_name);

  try {
    const result = await collection
      .find(query)
      .skip(parseInt(skip, 10)) 
      .limit(parseInt(limit, 10)) 
      .sort({ createdDate: constants.NUMBERS.NEGATIVE_ONE }) 
      .toArray();

    return { result };
  } catch (e) {
    throw e;
  }
}



    async createDoc(database, coll_name, doc) {
    const collection = database.collection(coll_name);
    const options = { ordered: true };
    try {
      if (doc.length > 1) {
        return await collection.insertMany(doc, options);
      }
      return await collection.insertOne(doc);
    } catch (e) {
      return e;
    }
  }
    async updateOneDoc(database, coll_name, query, doc) {
    const collection = database.collection(coll_name);
    try {
      return await collection.updateOne(query, doc);
    } catch (e) {
      return e;
    }
  }

  async countDocuments(database, coll_name,query) {
  const collection = database.collection(coll_name);
  try {
    return await collection.countDocuments(query);
  } catch (error) {
    console.error("Error counting documents:", error);
    return 0; 
  }
}

async addReply(database,coll_name,postId, replyBody){  
  const collection = database.collection(coll_name);
  try{
    let data = await collection.updateOne ({ _id: new ObjectId(postId) }, 
    {  $set: { active: constants.STATUS.TRUE },$push: { replies: replyBody } } )
    return data;
  } catch (error) {
    return error; 
  }
}

}


module.exports = new CRUDOperations();
