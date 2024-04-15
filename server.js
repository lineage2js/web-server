const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const server = express();
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

server.use(cors());
server.use(json());

server.post('/registration/', async (request, response) => {
  const login = request.body.login;
  const password = request.body.password;
  
  await mongoClient.connect();

  const db = mongoClient.db("l2db");

  const isExist = await db.collection('accounts').findOne({ login });

  if (isExist) {
    response.send({
      status: 'failed'
    });

    return
  }
  
  const accountsIds = await db.collection('accounts').find({}, { projection: { _id: 0, id: 1 } }).sort({ id: 1 }).toArray();

  await db.collection('accounts').insertOne({
    id: accountsIds[accountsIds.length - 1].id + 1,
    login,
    password
  });

  response.send({
    status: 'success'
  });
});

server.listen(80);