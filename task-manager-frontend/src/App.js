import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', assigned_to: '', priority: 'Média' });
    const [editingTask, setEditingTask] = useState(null); 

    useEffect(() => {
        axios.get('http://localhost:3000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    const createTask = () => {
        axios.post('http://localhost:3000/tasks', newTask)
            .then(response => {
                setTasks([...tasks, { ...newTask, id: response.data.insertId }]);
                setNewTask({ title: '', description: '', deadline: '', assigned_to: '', priority: 'Média' });
            })
            .catch(error => console.error(error));
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(() => {
                setTasks(tasks.filter(task => task.id !== id));
            })
            .catch(error => console.error(error));
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find(task => task.id === id);
        setEditingTask(taskToEdit);
        setNewTask({
            title: taskToEdit.title,
            description: taskToEdit.description,
            deadline: taskToEdit.deadline.split('T')[0], // Formata a data para input 'date'
            assigned_to: taskToEdit.assigned_to,
            priority: taskToEdit.priority
        });
    };

    const updateTask = () => {
        axios.put(`http://localhost:3000/tasks/${editingTask.id}`, newTask)
            .then(() => {
                setTasks(tasks.map(task => task.id === editingTask.id ? { ...newTask, id: editingTask.id } : task));
                setNewTask({ title: '', description: '', deadline: '', assigned_to: '', priority: 'Média' });
                setEditingTask(null); // Terminar a edição
            })
            .catch(error => console.error(error));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'Alta':
                return 'bg-danger text-light'; // Vermelho
            case 'Média':
                return 'bg-warning text-dark'; // Amarelo
            case 'Baixa':
                return 'bg-success text-light'; // Verde
            default:
                return '';
        }
    };

    // Ordenar as tarefas por prioridade (Alta > Média > Baixa)
    const sortedTasks = tasks.sort((a, b) => {
        const priorities = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
        return priorities[b.priority] - priorities[a.priority];
    });

    return (
        <div className="app-container">
            <div className="container mt-5">
                <h1 className="text-center text-light mb-4">Gerenciador de Tarefas</h1>

                <div className="card p-4 mb-5 shadow-lg">
                    <h3 className="mb-3">{editingTask ? "Editar Tarefa" : "Criar Nova Tarefa"}</h3>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Título"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Descrição"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={newTask.deadline}
                            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Atribuído a"
                            value={newTask.assigned_to}
                            onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Prioridade:</label>
                        <select
                            className="form-control"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <option value="Alta">Alta</option>
                            <option value="Média">Média</option>
                            <option value="Baixa">Baixa</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={editingTask ? updateTask : createTask}>
                        <i className="fas fa-plus-circle"></i> {editingTask ? "Atualizar Tarefa" : "Criar Tarefa"}
                    </button>
                </div>

                <ul className="list-group">
                    {sortedTasks.map(task => (
                        <li key={task.id} className={`list-group-item mb-3 shadow-sm task-item ${getPriorityClass(task.priority)}`}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p><strong>Prazo:</strong> {formatDate(task.deadline)}</p>
                            <p><strong>Atribuído a:</strong> {task.assigned_to}</p>
                            <p><strong>Prioridade:</strong> {task.priority}</p>
                            <button className="btn btn-warning mr-2" onClick={() => editTask(task.id)}>Editar</button>
                            <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
