const express = require('express');
const fs = require('fs');
const app = express();
const { v4: uuidv4 } = require('uuid');

let history = require('./history.json') || [];

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
    console.log("removing- message-index: ", messageToRemove, "message-id: ", id);
    saveHistory(history);
    res.send(history);

});

app.put('/messages/:id/:new', (req, res) => {
    let id = req.params.id;
    let messageToEdit = history.findIndex(message => message.id == id);
    history[messageToEdit].message = req.params.new;
    history[messageToEdit].edited = "(edited)";
    console.log("editing- message-index: ", messageToEdit, "message-id: ", id);
    saveHistory(history);
    res.send(history);
});

app.post('/messages', (req, res) => {
    history.push({
        id: uuidv4(),
        ...req.body,
    });
    saveHistory(history);
    res.send(history);
});



app.listen(8080);