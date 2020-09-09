const express = require('express');
const redis = require('redis');
const app = express();

const defaultRedisURL = 'redis://localhost:6379';
const client = redis.createClient(process.env.REDIS_URL || defaultRedisURL);

const { getDefaultStatus, getNextStatus } = require('./todoItemStates');
const defaultTodoList = () => ({ heading: 'Todo', todos: [], lastId: 0 });

client.get('todoList', (err, data) => {
  if (err) app.locals.todoList = defaultTodoList();
  app.locals.todoList = JSON.parse(data) || defaultTodoList();
});

const saveTodoList = function (req) {
  const data = JSON.stringify(req.app.locals.todoList);
  client.set('todoList', data, err => err && console.error(err));
};

app.use(express.static('./react-build'));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/api/todoList', (req, res) => res.json(req.app.locals.todoList));

app.get('/api/resetList', (req, res) => {
  const { todoList } = req.app.locals;
  todoList.todos = [];
  todoList.lastId = 0;
  saveTodoList(req);
  res.json(todoList);
});

app.post('/api/addTodo', (req, res) => {
  const { todoList } = req.app.locals;
  const content = req.body.content;
  const id = todoList.lastId++;
  todoList.todos.push({ content, id, status: getDefaultStatus() });
  saveTodoList(req);
  res.json(todoList);
});

app.post('/api/deleteTodo/:id', (req, res) => {
  const { todoList } = req.app.locals;
  todoList.todos = todoList.todos.filter(todo => todo.id !== +req.params.id);
  saveTodoList(req);
  res.json(todoList);
});

app.post('/api/updateHeading', (req, res) => {
  const { todoList } = req.app.locals;
  todoList.heading = req.body.heading;
  saveTodoList(req);
  res.json(todoList);
});

app.post('/api/toggleTodo/:id', (req, res) => {
  const { todoList } = req.app.locals;
  const todoToUpdate = todoList.todos.find(todo => todo.id === +req.params.id);
  todoToUpdate.status = getNextStatus(todoToUpdate.status);
  saveTodoList(req);
  res.json(todoList);
});

const PORT = process.env.PORT || process.argv[2] || 3001;

app.listen(PORT, () => console.log(`app running on ${PORT}`));
