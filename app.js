const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

const url = `${process.env.DB_CONNECT}`;

console.log(url)
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Successfully connected to the database');
    })
    .catch((err) => {
        console.error(`Error connecting to the database: ${err}`);
    });

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");



app.get("/", async (req, res) => {
    try {
        const tasks = await TodoTask.find({});
        res.render("todo.ejs", { todoTasks: tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});


app.route("/edit/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            const tasks = await TodoTask.find({});
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        } catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).send("Internal Server Error");
        }
    })
    .post(async (req, res) => {
        try {
            const id = req.params.id;
            await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
            res.redirect("/");
        } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).send("Internal Server Error");
        }
    });


app.route("/remove/:id").get(async (req, res) => {
    try {
        const id = req.params.id;
        await TodoTask.findOneAndDelete({ _id: id });
        res.redirect("/");
    } catch (error) {
        console.error("Error removing task:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
