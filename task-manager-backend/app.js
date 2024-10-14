const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'password',
    database: 'task_manager'
});

db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

app.get('/', (req, res) => {
    res.send('Bem-vindo ao Task Manager API!');
});

// Criar uma tarefa
app.post('/tasks', (req, res) => {
    const { title, description, deadline, assigned_to } = req.body;
    const sql = 'INSERT INTO tasks (title, description, deadline, assigned_to) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, deadline, assigned_to], (err, result) => {
        if (err) return res.status(500).send(err);
        // Retornar a nova tarefa com os dados que foram inseridos
        const newTask = {
            id: result.insertId, // ID gerado para a nova tarefa
            title,
            description,
            deadline,
            assigned_to
        };
        res.send(newTask);
    });
    });

// Listar todas as tarefas
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
    const { title, description, deadline, assigned_to } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE tasks SET title = ?, description = ?, deadline = ?, assigned_to = ? WHERE id = ?';
    db.query(sql, [title, description, deadline, assigned_to, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// Excluir uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// Lembrete de e-mail (exemplo básico usando nodemailer)
app.post('/reminder', (req, res) => {
    const { email, task } = req.body;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: `Lembrete de Tarefa: ${task.title}`,
        text: `Lembre-se de completar a tarefa: ${task.title} antes de ${task.deadline}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send('Lembrete enviado!');
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
