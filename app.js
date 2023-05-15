const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const router = express.Router();

const todos = [
  {
    id: 1,
    title: "network",
    description: "chapter 1 from network",
    completed: false,
  },
  {
    id: 2,
    title: "big data",
    description: "assignment Big data",
    completed: false,
  },
  {
    id: 3,
    title: "react",
    description: "assingnment React",
    completed: false,
  },
];

const middlewareTodo = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(422).json({ message: 'error, title and description are empty.' });
  }
  next();
};

const middlewareId = (req, res, next) => {
  const id = +req.params.id;
  const todo = todos.find(todo => todo.id === id);
  if (!todo) {
    return res.status(404).json({ message: `the id => ( ${id} ) not found.` });
  }
  req.todo = todo;
  next();
};

app.use('/static',express.static(path.join(__dirname, "public")));

app.get("/todos", (req, res) => {
  res.status(200).send(todos);
});



app.delete("/todos", (req, res) => {
  if (todos.length > 0) {
    const randomIndex = Math.floor(Math.random() * todos.length);
    const deletedTodo = todos.splice(randomIndex, 1)[0];
    res.status(204).json({ message: `Todo that it id is => ( ${deletedTodo.id} ) deleted` });
  } else {
    res.status(422).json({ message: "list of todo is empty" });
  }
});



router.get('/todos/:id', middlewareId, (req, res) => {
  res.status(200).json(req.todo);
});

router.delete('/todos/:id', middlewareId, (req, res) => {
  todos = todos.filter(singleTodo => singleTodo.id !== req.todo.id);
  res.status(204).send();
});

router.post('/todos', middlewareTodo, (req, res) => {
  const { title, description } = req.body;
  const newTodo = { id: todos.length + 1, title, description };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put('/todos/:id', middlewareId, (req, res) => {
  const { title, description } = req.body;
  const updatedTodo = { ...req.todo, title, description };
  todos = todos.map(singleTodo => (singleTodo.id === req.todo.id ? updatedTodo : singleTodo));
  res.status(200).json(updatedTodo);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = router;