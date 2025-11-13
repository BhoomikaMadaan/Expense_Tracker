const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile('welcome.html', { root: 'public' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/user', require('./routes/user'));

app.listen(5000,()=>{
    console.log("server started on port 5000")
})