const mongoose = require('mongoose');

const commentSchema = new Schema({
  contentOffsetSeconds: { type: Number, default: constants.NUMBERS.ZERO },
  msg: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const imageFileSchema = new Schema({
  imageId: { type: Schema.Types.ObjectId, required: true, unique: true },
  comments: [commentSchema]
});

const ImageFile = mongoose.model('ImageFile', imageFileSchema);

module.exports = ImageFile;
