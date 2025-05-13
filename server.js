// ===== backend/server.js =====
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ogs = require('open-graph-scraper');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); 
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI; // Read MongoDB URI from environment variable
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Mongoose schemas and models
const commentSchema = new mongoose.Schema({
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  content: String,
  preview: {
    title: String,
    description: String,
    image: String,
    url: String,
  },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// Helper function for Open Graph scraping
const getPreview = async (url) => {
  try {
    const { result } = await ogs({ url });
    return {
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.url,
      url: result.requestUrl,
    };
  } catch {
    return null;
  }
};

// Routes
app.post('/api/posts', async (req, res) => {
  const { content } = req.body;
  const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
  let preview = null;

  if (urlMatch) {
    preview = await getPreview(urlMatch[0]);
  }

  const post = new Post({
    content,
    preview,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).send('Error saving post');
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (post) {
      post.likes++;
      await post.save();
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    res.status(500).send('Error liking post');
  }
});

app.post('/api/posts/:id/comments', async (req, res) => {
  const { comment } = req.body;
  try {
    const post = await Post.findOne({ id: req.params.id });
    if (post) {
      post.comments.push({ comment });
      await post.save();
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    res.status(500).send('Error adding comment');
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Error fetching posts');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
