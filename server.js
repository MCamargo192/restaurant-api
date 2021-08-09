/************************************************************************************************  
* WEB422 –Assignment1
* I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Marcelo A C Camargo Student ID: 143739191 Date: January, 18th 2021
* Heroku Link: https://morning-crag-64182.herokuapp.com/
************************************************************************************************/

const express = require('express');
const { wakeDyno } = require('heroku-keep-awake');
const cors = require('cors');
const RestaurantDB = require('./modules/restaurantDB.js');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const DYNO_URL = 'https://morning-crag-64182.herokuapp.com/';
const db = new RestaurantDB('mongodb+srv://mcamargo192:mcWEB422@2021@cluster0.our3z.mongodb.net/sample_restaurants?retryWrites=true&w=majority');

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.json({ message: 'API Listening' }));

// CREATE
app.post('/api/restaurants', (req, res) => {
    const data = req.body;
    db.addNewRestaurant(data)
        .then(msg => res.status(201).json({ message: msg }))
        .catch(err => res.status(500).json({ message: err.message }))
});

// READ (page, perPage and borough)
app.get('/api/restaurants/', (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const borough = req.query.borough || '';
    db.getAllRestaurants(page, perPage, borough)
        .then(restaurants => res.json(restaurants))
        .catch(err => res.status(500).json({ message: err.message }))
});

// READ by id
app.get('/api/restaurants/:id', (req, res) => {
    const id = req.params.id;
    db.getRestaurantById(id)
        .then(restaurant => res.json(restaurant))
        .catch(err => res.status(500).json({ message: err.message }))
});

// UPDATE
app.put('/api/restaurants/:id', (req, res) => {
    const data = req.body;
    const id = req.params.id;
    db.updateRestaurantById(data, id)
        .then(msg => res.status(200).json({ message: msg }))
        .catch(err => res.status(500).json({ message: err.message }))
});

// DELETE
app.delete('/api/restaurants/:id', (req, res) => {
    const id = req.params.id;
    db.deleteRestaurantById(id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({ message: err.message }))
});

db.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        wakeDyno(DYNO_URL);
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch(err => console.log(err));