require('dotenv').config();
const colors = require('colors');
const express = require('express')
const schema = require('./schema/schema');
const connectDB = require('./config/db');

const { graphqlHTTP } = require('express-graphql');

const port = process.env.PORT || 8000
const app = express()

// Connect to DB
connectDB()



app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
    
}))
app.listen(port, console.log(`I'm Listening on port ${port}!`));
