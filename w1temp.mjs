'use strict';
const port = 8645;
import express from 'express';
import path from 'node:path';
import fs from 'fs';
import sqlite3 from 'sqlite3';

//__dirname fix for module from: https://github.com/nodejs/help/issues/2907
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const db = new sqlite3.Database(path.join(__dirname, 'w1temps.db'));

app.get('/', (req, res) => {
    res.send('good');
});

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/live', (req, res) => {
  res.render('live', {ccipquery: process.env.CCIP_QUERY});
});

app.get('/radar', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'radar.html'));
});

app.get('/w1temp', (req, res) => {
    let w1temps = [];
    db.each("SELECT datetime(time_stamp, 'localtime') as time_stamp, w1temp FROM w1temps WHERE datetime(time_stamp, 'localtime') >= datetime('now', '-48 hours', 'localtime') ORDER BY time_stamp ASC", (err, row) => {
        if(!err & row.length !=0){
            w1temps.push({x:Date.parse(row.time_stamp), y:row.w1temp});
        }
    }, function(){
        res.json(w1temps);
    });
});

app.get('/dblast', (req, res) => {
    let w1temps = [];
    db.each("SELECT datetime(time_stamp, 'localtime') as time_stamp, w1temp FROM w1temps ORDER BY time_stamp DESC LIMIT 1", (err, row) => {
        if(!err & row?.length != 0){
            w1temps = [row.time_stamp, row.w1temp];
        }
    }, function(){
        res.json(w1temps);
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

