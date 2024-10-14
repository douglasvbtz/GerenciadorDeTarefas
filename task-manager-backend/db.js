const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'db', // Nome do serviço definido no docker-compose
  user: 'root', // Usuário do banco de dados
  password: 'password', // Senha definida no docker-compose
  database: 'task_manager' // Nome do banco de dados
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

module.exports = connection;