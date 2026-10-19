import express from 'express';
import { uploader } from './util.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Alternativa para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data=[
    {id:1,username: 'Wilmer', email: 'wilmer@example.com', rol: 'admin'},
    {id:2,username: 'Juan', email: 'juan@example.com', rol: 'user'},
    {id:3,username: 'Maria', email: 'maria@example.com', rol: 'user'},
    {id:4,username: 'Pedro', email: 'pedro@example.com', rol: 'user'}
]


const app = express()
const PORT = 3000

app.use(express.urlencoded ({extended: true}));
app.use(express.json());

app.use(express.static(__dirname+ '/../public'));

app.get('/api/', (req, res) => {
  res.send('HOLA MUNDO!')
})

app.get('/api/users', (req, res) => {
  res.json(data)
})

app.get('/api/users/:id/:username', (req, res) => {
  const {id, username} = req.params;
  const user = data.find(u => u.id === parseInt(id) && u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.get('/api/users/:id', (req, res) => {
  const {id} = req.params;
  const user = data.find(u => u.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.get('/api/users/consulta', (req, res) => {
  const {id, username} = req.query;  
  const user = data.find(u => u.id === parseInt(id) && u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const {id, username, email, rol} = req.body;
  if(!id || !username || !email || !rol) {
    return res.status(400).json({ error: 'Faltan campos para crear un usuario' });
  }
  const newUser = {id, username, email, rol};
  data.push(newUser);
  res.status(201).json(newUser);
});

//app.post('/profile', , function (req, res, next) {

app.post('/api/userFile',uploader.single('avatar'), (req, res) => {
  const file = req.file;
  console.log(file);
  if (!file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }
  const {id, username, email, rol} = req.body;
  if(!id || !username || !email || !rol) {
    return res.status(400).json({ error: 'Faltan campos para crear un usuario' });
  }
  const newUser = {id, username, email, rol, file};
  data.push(newUser);
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})