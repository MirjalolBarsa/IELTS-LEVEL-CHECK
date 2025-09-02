const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Test server ishga tushdi!' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
});
