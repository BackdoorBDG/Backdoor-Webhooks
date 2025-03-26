const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load or initialize webhook data
const dataFile = path.join(__dirname, 'data.json');
let webhooks = {};
if (fs.existsSync(dataFile)) {
    webhooks = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

// Save data to file
function saveData() {
    fs.writeFileSync(dataFile, JSON.stringify(webhooks, null, 2));
}

// Create a new webhook
app.post('/api/webhooks', (req, res) => {
    const webhookId = uuidv4();
    const webhookUrl = `${req.protocol}://${req.get('host')}/webhook/${webhookId}`;
    webhooks[webhookId] = { url: webhookUrl, data: [] };
    saveData();
    res.json({ id: webhookId, url: webhookUrl });
});

// Webhook endpoint to receive data
app.post('/webhook/:id', (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    if (webhooks[id]) {
        webhooks[id].data.push({
            timestamp: new Date().toISOString(),
            payload,
        });
        saveData();
        res.status(200).json({ message: 'Data received' });
    } else {
        res.status(404).json({ error: 'Webhook not found' });
    }
});

// Get webhook data
app.get('/api/webhooks/:id', (req, res) => {
    const { id } = req.params;
    if (webhooks[id]) {
        res.json(webhooks[id]);
    } else {
        res.status(404).json({ error: 'Webhook not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
