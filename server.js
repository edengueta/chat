const express = require('express');
const fs = require('fs');
const app = express();

let history = require('./history.json') || [];
let uuid = history.length > 0 ? history[history.length - 1].id + 1 : 0;

function saveHistory(history) {
    fs.writeFileSync('history.json', JSON.stringify(history), { encoding: 'utf-8' });
}
app.use(express.json());

app.get('/', (req, res) => {
    res.send(
        fs.readFileSync('index.html', { encoding: 'utf-8' })
    );
});

app.get('/messages', (req, res) => {
    res.send(history);
});

app.get('/messages/:id', (req, res) => {
    console.log(req.params.id);
    res.send('Not found!');
});

app.delete('/messages', (req, res) => {
    history = [];
    saveHistory(history);
    res.send(history);
});

app.delete('/messages/:id', (req, res) => {
    let id = req.params.id;
    let messageToRemove = history.findIndex(message => message.id == id);
    history.splice(messageToRemove, 1);
    saveHistory(history);
    res.send(history);

});

app.put('/messages/:id/:new', (req, res) => {
    let id = req.params.id;
    let messageToEdit = history.findIndex(message => message.id == id);
    history[messageToEdit].message = req.params.new;
    history[messageToEdit].edited = "(edited)";
    saveHistory(history);
    res.send(history);
});

app.post('/messages', (req, res) => {
    history.push({
        id: uuid,
        ...req.body,
    });
    uuid++;
    saveHistory(history);
    res.send(history);
});



app.listen(8080);