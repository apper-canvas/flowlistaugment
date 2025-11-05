import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.storageKey = "flowlist_tasks";
    this.tasks = this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored tasks:", error);
      }
    }
    // Initialize with default data if nothing in storage
    const defaultTasks = [...tasksData];
    this.saveToStorage(defaultTasks);
    return defaultTasks;
  }

  saveToStorage(tasks) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await this.delay();
    const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      category: taskData.category || "Personal",
      priority: taskData.priority || "medium",
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.push(newTask);
    this.saveToStorage(this.tasks);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id) // Ensure Id doesn't change
    };
    
    // Handle completion timestamp
    if (taskData.completed !== undefined) {
      updatedTask.completedAt = taskData.completed ? new Date().toISOString() : null;
    }
    
    this.tasks[index] = updatedTask;
    this.saveToStorage(this.tasks);
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    this.tasks.splice(index, 1);
    this.saveToStorage(this.tasks);
    return true;
  }

  async getByCategory(category) {
    await this.delay();
    return this.tasks.filter(t => t.category === category).map(t => ({ ...t }));
  }

  async getByPriority(priority) {
    await this.delay();
    return this.tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  }

  async search(query) {
    await this.delay();
    const lowerQuery = query.toLowerCase();
    return this.tasks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
    ).map(t => ({ ...t }));
  }

  async getCompleted() {
    await this.delay();
    return this.tasks.filter(t => t.completed).map(t => ({ ...t }));
  }

  async getActive() {
    await this.delay();
    return this.tasks.filter(t => !t.completed).map(t => ({ ...t }));
  }
}

export default new TaskService();