// tarefa3-todo-manager/todoManager.test.js
const { TodoManager } = require('./todoManager');

describe('Sistema de Gerenciamento de Tarefas', () => {
  let manager;

  beforeEach(() => {
    manager = new TodoManager('PROJ'); // novo manager antes de cada teste
  });

  test('deve criar uma tarefa com dados básicos e código Jira', () => {
    const task = manager.createTask({
      title: 'Implementar login',
      description: 'Criar sistema de autenticação',
      priority: 'high'
    });

    expect(task.id).toBe(1);
    expect(task.code).toBe('PROJ-1');
    expect(task.title).toBe('Implementar login');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('high');
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
    expect(task.completedAt).toBeNull();
  });

  test('deve listar todas as tarefas criadas', () => {
    manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    manager.createTask({ title: 'T2', description: 'D2', priority: 'medium' });
    const tasks = manager.listTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('T1');
    expect(tasks[1].title).toBe('T2');
  });

  test('deve atualizar dados de uma tarefa existente', () => {
    const task = manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    const updated = manager.updateTask(task.id, { title: 'Novo T1', priority: 'high' });
    expect(updated.title).toBe('Novo T1');
    expect(updated.priority).toBe('high');
    expect(updated.updatedAt.getTime()).toBeGreaterThan(task.createdAt.getTime());
  });

  test('deve remover uma tarefa por ID', () => {
    const task = manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    const removed = manager.deleteTask(task.id);
    expect(removed).toBe(true);
    expect(manager.listTasks().length).toBe(0);
  });

  test('deve alterar status da tarefa e definir completedAt', () => {
    const task = manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    const updated = manager.changeTaskStatus(task.id, 'done');
    expect(updated.status).toBe('done');
    expect(updated.completedAt).toBeInstanceOf(Date);
  });

  test('deve filtrar tarefas por status TODO', () => {
    manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    const t2 = manager.createTask({ title: 'T2', description: 'D2', priority: 'medium' });
    manager.changeTaskStatus(t2.id, 'done');
    const todos = manager.filterTasksByStatus('todo');
    expect(todos.length).toBe(1);
    expect(todos[0].status).toBe('todo');
  });

  test('deve filtrar tarefas por prioridade HIGH', () => {
    manager.createTask({ title: 'T1', description: 'D1', priority: 'high' });
    manager.createTask({ title: 'T2', description: 'D2', priority: 'low' });
    const high = manager.filterTasksByPriority('high');
    expect(high.length).toBe(1);
    expect(high[0].priority).toBe('high');
  });

  test('deve buscar tarefas por título', () => {
    manager.createTask({ title: 'Comprar leite', description: 'D1', priority: 'low' });
    manager.createTask({ title: 'Comprar pão', description: 'D2', priority: 'medium' });
    const results = manager.searchTasks('leite');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Comprar leite');
  });

  test('deve contar tarefas por status', () => {
    const t1 = manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    const t2 = manager.createTask({ title: 'T2', description: 'D2', priority: 'medium' });
    manager.changeTaskStatus(t2.id, 'done');
    const counts = manager.getTaskCounts();
    expect(counts.todo).toBe(1);
    expect(counts.done).toBe(1);
    expect(counts.in_progress).toBe(0);
  });

  test('deve gerar códigos únicos sequenciais', () => {
    const c1 = manager.generateTaskCode();
    const c2 = manager.generateTaskCode();
    const c3 = manager.generateTaskCode();
    expect(c1).toBe('PROJ-1');
    expect(c2).toBe('PROJ-2');
    expect(c3).toBe('PROJ-3');
  });

  test('deve encontrar tarefa por código Jira', () => {
    const task = manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    const found = manager.findTaskByCode(task.code);
    expect(found).not.toBeNull();
    expect(found.id).toBe(task.id);
  });

  test('deve gerenciar ciclo completo de uma tarefa', () => {
    const task = manager.createTask({ title: 'T1', description: 'D1', priority: 'low' });
    manager.updateTask(task.id, { title: 'T1 updated' });
    manager.changeTaskStatus(task.id, 'in_progress');
    const filtered = manager.filterTasksByStatus('in_progress');
    const searched = manager.searchTasks('updated');
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('in_progress');
    expect(searched.length).toBe(1);
    expect(searched[0].title).toBe('T1 updated');
  });

  test('deve lidar com operações em tarefas inexistentes', () => {
    const update = manager.updateTask(999, { title: 'X' });
    const remove = manager.deleteTask(999);
    const status = manager.changeTaskStatus(999, 'done');
    expect(update).toBeNull();
    expect(remove).toBe(false);
    expect(status).toBeNull();
  });
});
