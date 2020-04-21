'use strict';

const { MongoClient } = require('mongodb');
const assert = require('assert');
const fs = require('file-system');


const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
});

const allSeats = JSON.parse(fs.readFileSync('server/seats.json'));
console.log('allSeats', allSeats);
const getSeats = async (req, res) => {
    try {
        await client.connect();
        console.log('connected!');

        const db = client.db('seats');
        console.log('req.body', req.body);

        let result = await db.collection('seatDetail').insertMany(allSeats);

        assert.equal(allSeats.length, result.insertedCount);
        console.log('success');
        res.status(200).json({ status: 200 });

    }
    catch (err) {

        res.status(404).json({ status: 404 });
        console.log(err.stack);
    }
    // close the connection to the database server
    client.close();
    console.log('disconnected!');

};

const updateSeat = async (req, res) => {
    const { _id } = req.params;
    const { isBooked, fullName, email } = req.body;
    console.log('reqBody', req.body);

    if (!isBooked) {
        res.status(400)
            .json({
                status: 400,
                data: req.body,
                message: 'Only "isBooked", "fullName" and "email" may be updated.',
            });
        return;
    }

    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });

    await client.connect();
    const db = client.db('seats');

    try {
        await client.connect();
        const db = client.db('seats');

        const query = { _id };
        const newValues = { $set: { isBooked, fullName: fullName, email: email } };
        const r = await db.collection('seatDetail').updateOne(query, newValues);
        assert.equal(1, r.matchedCount);
        assert.equal(1, r.modifiedCount);
        res.status(200).json({ status: 200, _id });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }

    client.close();
};

module.exports = { getSeats, updateSeat };
