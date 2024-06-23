const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const app = express();
const db = require('./db');
const Response = require('./models/response');
const fs = require("fs");
app.use(bodyParser.json());


const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getGoogleSheetData() {
    const client = await auth.getClient();
    const res = await sheets.spreadsheets.values.get({
        auth: client,
        spreadsheetId: '1uQ9T4JTO4N75pW4H2p0lgPpw_QeCik5ONx9sMdrfJao',
        range: 'A:D',
    });
    return res.data.values;
}


app.get('/',function(req,res){
    res.send('hiii')
})

app.get('/fetchstore', async (req, res) => {
    try {
        const rows = await getGoogleSheetData();
        const responses = rows.slice(1).map(row => ({
            timestamp: row[0] ? new Date(row[0]) : null,  // Assuming the timestamp is in the 0th column
            name: row[1],
            score: parseInt(row[2])  // Ensure score is a number
        })).filter(response => response.timestamp);  // Filter out responses without a timestamp

        // Fetch existing timestamps
        const existingTimestamps = await Response.find({}, 'timestamp').lean();
        const existingTimestampSet = new Set(existingTimestamps.map(item => item.timestamp && item.timestamp.toISOString()));

        // Filter out responses with existing timestamps
        const newResponses = responses.filter(response => !existingTimestampSet.has(response.timestamp.toISOString()));

        if (newResponses.length > 0) {
            await Response.insertMany(newResponses);
        }

        res.send(`Data fetched and stored in MongoDB. Inserted ${newResponses.length} new records.`);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));