const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.ip}\n`;
    fs.appendFileSync('visits.log', logEntry);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/logs', (req, res) => {
    fs.readFile('visits.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read log file' });
        }
        res.json({ logs: data.split('\n').filter(line => line) });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
