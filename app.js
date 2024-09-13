var express = require('express')
var app = express()
const fs = require('fs');
const PORT = 5000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static("public"))


app.post('/submit', (req, res) => {
    const userData = req.body;
  // Read existing JSON file or create an empty array if it doesn't exist
    let jsonData = [];
    try {
    const rawData = fs.readFileSync('data.json');
    jsonData = JSON.parse(rawData);
    } catch (err) {
        // Ignore error if file doesn't exist
    }

    // Add new user data to the array
    jsonData.push(userData);

    // Write updated data to the JSON file
    fs.writeFileSync('data.json', JSON.stringify(jsonData));

    res.send('Data saved successfully!');
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
