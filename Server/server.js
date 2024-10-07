const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dataUtils = require('./utils/utils');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});



app.post('/api/register', (req, res) => {
  try {
    const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const data = dataUtils.checkUser({email,password});
  if(data && data.email){
    return res.status(409).json({ message: 'email already registered'});
  }
  const userData = dataUtils.readDataFromFile();
  const newEntry = { id: userData.length + 1, email, password };
  userData.push(newEntry);
  
  dataUtils.writeDataToFile(userData);
  return res.status(201).json({ message: 'Data saved successfully', entry: newEntry });
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong',error:error.message});
  }
});


app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const data = dataUtils.checkUser({email,password});
  if(!data){
    return res.status(401).json({ message: 'incorrect email/password'});
  }
  return res.status(200).json({ message: 'login successful', userInfo: data });
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong',error:error.message});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
