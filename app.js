var express = require('express')
var app = express()
const fs = require('fs');
const PORT = 5000
const path = require('path');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static("public"))


//EVENTS

app.post('/events', (req, res) => {
    const { event, name, email } = req.body;

    if (!event || !name || !email) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const attendeeData = {
        name: event,
        attendee: name,
        Email: email
    };

    const filePath = path.join(__dirname, 'data', 'register.json');

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

//ADMIN

//Load tasks from the JSON file
const getTasks = () => {
    const data = fs.readFileSync('./data/data.json', 'utf8');
    return JSON.parse(data);
}

const saveTasks = (tasks) => {
    fs.writeFileSync('./data/data.json', JSON.stringify(tasks, null, 2));
};

//Routes


//POST: Create a new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();
    const newTasks = {
        id: tasks.length+1,
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
    };
    tasks.push(newTasks);
    saveTasks(tasks);
    res.redirect('/');
});

//GET: Shows a single task (for editing)
app.get('/tasks/:id/edit', (req,res) => {
    const tasks = getTasks();
    const task = tasks.find(task => task.id == req.params.id);
    res.render('tasks', { task });
});

//PUT: Update a task
app.post('/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    tasks[taskIndex].description = req.body.description;
    tasks[taskIndex].name = req.body.name;
    tasks[taskIndex].date = req.body.date;
    saveTasks(tasks);
    res.redirect('/');
});

//DELETE: Delete a task
app.post('/tasks/:id/delete', (req,res) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.redirect('/');
});

app.get('/', function(req,res){
    let tasks = getTasks();
    res.render('events', { tasks })
})

app.get('/admin', function(req,res){
    let tasks = getTasks();
    res.render('admin', { tasks });
})

app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`)
})