console.log("Início Tarefa 3 - ['SEM IA']");

class Task {
  constructor({ id, code, title, description, priority }) {
    this.id = id; // ID numérico único
    this.code = code; // Código estilo Jira
    this.title = title;
    this.description = description;
    this.status = 'todo'; // status inicial
    this.priority = priority; // 'low' | 'medium' | 'high'
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.completedAt = null;
  }
}

class TodoManager {
  constructor(projectPrefix = 'PROJ') {
    this.tasks = [];
    this.projectPrefix = projectPrefix.toUpperCase();
    this.counter = 0; // contador para gerar códigos únicos
  }

  // Gera código único estilo Jira
  generateTaskCode() {
    this.counter += 1;
    return `${this.projectPrefix}-${this.counter}`;
  }

  // Criar nova tarefa
  createTask({ title, description, priority }) {
    if (!title || !priority) {
      throw new Error('Título e prioridade são obrigatórios');
    }
    if (!['low', 'medium', 'high'].includes(priority)) {
      throw new Error('Prioridade inválida');
    }
    const id = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1;
    const code = this.generateTaskCode();
    const task = new Task({ id, code, title, description, priority });
    this.tasks.push(task);
    return task;
  }

  // Listar todas as tarefas
  listTasks() {
    return [...this.tasks];
  }

  // Encontrar tarefa por ID
  findTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  // Encontrar tarefa por código Jira
  findTaskByCode(code) {
    return this.tasks.find(task => task.code === code) || null;
  }

  // Atualizar tarefa
updateTask(id, updates) {
  const task = this.tasks.find(t => t.id === id);
  if (!task) return null;

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.priority !== undefined) task.priority = updates.priority;

  // Forçar timestamp ligeiramente maior que createdAt
  let now = new Date();
  if (now.getTime() <= task.createdAt.getTime()) {
    now = new Date(task.createdAt.getTime() + 1); // adiciona 1ms
  }
  task.updatedAt = now;

  return task;
}



  // Remover tarefa
  deleteTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  // Alterar status
  changeTaskStatus(id, newStatus) {
    const task = this.findTaskById(id);
    if (!task) return null;
    if (!['todo', 'in_progress', 'done'].includes(newStatus)) {
      throw new Error('Status inválido');
    }
    task.status = newStatus;
    task.updatedAt = new Date();
    task.completedAt = newStatus === 'done' ? new Date() : null;
    return task;
  }

  // Filtrar tarefas por status
  filterTasksByStatus(status) {
    if (!['todo', 'in_progress', 'done'].includes(status)) return [];
    return this.tasks.filter(task => task.status === status);
  }

  // Filtrar tarefas por prioridade
  filterTasksByPriority(priority) {
    if (!['low', 'medium', 'high'].includes(priority)) return [];
    return this.tasks.filter(task => task.priority === priority);
  }

  // Buscar tarefas por título (parcial)
  searchTasks(keyword) {
    const lower = keyword.toLowerCase();
    return this.tasks.filter(task => task.title.toLowerCase().includes(lower));
  }

  // Contar tarefas por status
  getTaskCounts() {
    const counts = { todo: 0, in_progress: 0, done: 0 };
    this.tasks.forEach(task => {
      counts[task.status] += 1;
    });
    return counts;
  }
}

module.exports = { TodoManager, Task };