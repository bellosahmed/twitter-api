const express = require('express');
const dotenv = require('dotenv');
const db = require('./db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');


dotenv.config();

db();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/users", userRoutes)

const port = process.env.PORT || 8888;

app.listen(port, () => console.log(`Server running on port ${port}`));