const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

connectDB();

// middleware
app.use(cors());
app.use(express.json({ extended: false }));

// api endpoints
app.use('/api/users', require('./routes/api/users.api'))
app.use('/api/profile', require('./routes/api/profile.api'))
app.use('/api/posts', require('./routes/api/posts.api'))
app.use('/api/auth', require('./routes/api/auth.api'))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})