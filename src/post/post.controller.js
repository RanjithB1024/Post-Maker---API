const httpStatus = require("http-status");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const postService = require("../post/post.service");
const constants = require("../constants/constants");
const crudservice = require("../services/crud-service");
var stream = require("stream");
const { GridFSBucket } = require("mongodb");
const emoji = require("node-emoji");
const multer = require("multer");
const uploads = multer().any();
const { handleException, exception,getAdjustedCurrentDate } = require("../../utils");
const imageService = require("../utils/image.service");
const profileImageDownloadPath = "/v0.1/upload/Image/";

const uploadVideos = async (req, res, next) => {
  try {
    const { files } = req;
    const uploadPromises = [];
    for (const fieldName in files) {
      const fieldFiles = Array.isArray(files[fieldName])
        ? files[fieldName]
        : [files[fieldName]];
      for (const file of fieldFiles) {
        const bucketName = file.mimetype.startsWith("image")
          ? "images"
          : "videos";
        const bucket = new GridFSBucket(req.app.locals.database, {
          bucketName,
        });
        const uploadStream = bucket.openUploadStream(file.originalname);
        const readableStream = new stream.Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
        const uploadPromise = new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            let fileId =
              (file.mimetype.startsWith("image") ? "images" : "videos") + "id";
            resolve({ filename: file.originalname, [fileId]: uploadStream.id });
          });
          uploadStream.on("error", (err) => {
            reject(err);
          });
        });
        uploadPromises.push(uploadPromise);
      }
    }
    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  } catch (error) {
    exception(res, error.message);
  }
};


exports.appAssement = (req,res)=>{
  res.send("App assesment")
}

exports.upload = async (req, res) => {
  const updateDate = new Date();
  await uploads(req, res, async (err) => {
    if (err) {
      return exception(res, err.message);
    }

    const reqBodyObj = JSON.parse(JSON.stringify(req.body));
    
    try {
      let videoFileReturn = await uploadVideos(req, res);
      let presentDate = getAdjustedCurrentDate();

 
        let date = new Date();
        let name = "-" + date.getFullYear() + date.getDate() + date.getHours();
        filesArrayObj = req.files;
        const descriptionWithEmojis = emoji.emojify(reqBodyObj.description);
        let body = {
          imageFileName:
            videoFileReturn[0]?.filename + videoFileReturn[0]?.imagesid + name,
          createdDate: presentDate,
          imagesId: videoFileReturn[0]?.imagesid,
          description: descriptionWithEmojis,
          // createdBy: reqBodyObj.createdBy,
          // appName: reqBodyObj.appName,
          // from:reqBodyObj.from,
          // email:reqBodyObj.email,
          // active:constants.STATUS.FALSE
          };

        let postData = await postService.create(req.app.locals.database, body);
        if (postData) {
          return handleException(
            httpStatus.OK,
            constants.STATUS_MESSAGES.POST_UPLOADED,
            res
          );
        }
      
    } catch (err) { 
     return exception(res);
    }
  });
};



exports.fetchPost = async (req, res) => {
  if (req.query.page < constants.NUMBERS.ZERO) {
    handleException(
      httpStatus.BAD_REQUEST,
      constants.STATUS_MESSAGES.PAGINATION,
      res
    );
    return;
  }

  const { from, appName, email, createdBy, _id, page, search,active } = req.query;  
  try {
    console.log("req.query",req.query);
     let limit = constants.NUMBERS.LIMIT || 10; 
    let offset = page ? (parseInt(page) - 1) * limit : 0;
    const currentPage = parseInt(page, 10) || 1; 
 let baseQuery;
    // let baseQuery = {
    //   ...(appName && { appName }),
    //   ...(search
    //     ? {
    //         $or: [
    //           { createdBy: { $regex: new RegExp(search, 'i') } }, 
    //           { email: { $regex: new RegExp(search, 'i') } }, 
    //         ],
    //       }
    //     : {}),
    //   ...(from && { from }),
    //   ...(_id && { _id: ObjectId.isValid(_id) ? new ObjectId(_id) : _id }),
    //   // ...(createdBy && {createdBy :{ $regex: new RegExp(createdBy, 'i') } }),
    // };

  //   if(active){
  //     baseQuery.active = active === constants.POSTS.ACTIVE ? true : (active === constants.POSTS.INACTIVE ? false : constants.POSTS.UNDEFINED);
  //  }
    const totalRecords = await postService.countDocuments(req.app.locals.database, baseQuery);
    const data = await postService.readWithPagination(
      req.app.locals.database,
      baseQuery,
      limit,
      parseInt(offset, 10) 
    );
    const processedData = await Promise.all(
      data.result.map(async (item) => {
        const imageFilter = { _id: item.imagesId };
        const imageData = await imageService.read(req.app.locals.database, imageFilter);
        let doc = {};
        if (imageData.length > constants.NUMBERS.ZERO) {
          doc = {
            name: imageData[0].filename,
            url: process.env.imgBaseUrl + profileImageDownloadPath + imageData[0].filename,
          };
        }
        return {
          ...item,
          image: doc,
        };
      })
    );
    console.log("processedData",processedData)
    // const groupedData = {
    //   suggestions: [],
    //   bugs: [],
    // };
    //   processedData.forEach((item) => {
    //   if (item.from && item.from.toLowerCase() === constants.POSTS.SUGGESTIONS) {
    //     groupedData.bugs.push(item);
    //   } else if (item.from && item.from.toLowerCase() === constants.POSTS.BUG) {
    //     groupedData.bugs.push(item);
    //   }
    // });
    if(processedData.length>0){
    res.json({
      status: httpStatus.OK,
      response: {
        result: processedData,
        totalPages: Math.ceil(totalRecords / limit), 
        currentPage: currentPage,
        limit: limit,
        total_records: totalRecords,
      },
    });
    }else{
     res.status(constants.ERRORCODES.DOES_NOT_EXIST).json({
     status: constants.STATUS.FALSE,
     message: constants.STATUS_MESSAGES.NO_RECORDS,
      });
     }
  } catch (error) {
    console.log("error",error)
    exception(res);
  }
};





exports.download = async (req, res) => {
  try {
    const bucket = new GridFSBucket(req.app.locals.database, {
      bucketName: "images",
    });
    let downloadStream = bucket.openDownloadStreamByName(req.params.name);
    let dataBuffers = [];
    downloadStream.on("data", function (data) {
      dataBuffers.push(data);
    });
    downloadStream.on("error", function (err) {
      handleException(
        httpStatus.NOT_FOUND,
        constants.STATUS_MESSAGES.CANNOT_DOWNLOAD,
        res
      );
      return;
    });
    downloadStream.on("end", () => {
      const concatenatedBuffer = Buffer.concat(dataBuffers);
     return res.status(httpStatus.OK).end(concatenatedBuffer);
    });
  } catch (error) {
    exception(res);
  }
};


exports.replyToComment = async (req, res) => {
  try {
    if (req.body.role && req.body.role === constants.POSTS.ADMIN) {
      const { postId, reply } = req.body;
      if (!postId || !reply) {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: constants.POSTS.POST_ID_AND_REPLY
        });
      }
    let presentDate = getAdjustedCurrentDate();
      const replyBody = {
        reply: reply,
        replied_by: req.body.created_by, 
        replied_at: presentDate
      };

      let replyData = await postService.addReply(req.app.locals.database, postId, replyBody);
      if (replyData) {
        return res.status(httpStatus.OK).json({
          success: true,
          message: constants.POSTS.REPLY_ADDED
        });
      } else {
        return res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: constants.POSTS.FAILED_TO_ADD_REPLY
        });
      }
    } else {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message:constants.POSTS.ONLY_ADMINS
      });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: constants.POSTS.ERROR_REPLY
    });
  }
};



