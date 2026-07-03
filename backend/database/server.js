const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Backend is running" });
});

app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});
