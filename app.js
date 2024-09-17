var express = require('express')
var app = express()
const fs = require('fs');
const PORT = 5000
const path = require('path');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static("public"))


app.post('/events', (req, res) => {
    const { event, name, email } = req.body;

    if (!event || !name || !email) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const attendeeData = {
        eventName: event,
        Name: name,
        Email: email
    };

    const filePath = path.join(__dirname, 'data', 'data.json');

    fs.readFile(filePath, 'utf8', (err, fileContent) => {

        let jsonData = [];

        try {
            jsonData = JSON.parse(fileContent);
        } catch (e) {

        }
        jsonData.push(attendeeData);

        // Write updated data back to file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            res.redirect('/events')
        });
    });
});
app.get('/events', function(req,res){
    res.render('events')
})

app.get('/admin', function(req,res){
    res.render('admin')
})

app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`)
})
