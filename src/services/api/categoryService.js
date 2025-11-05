import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.storageKey = "flowlist_categories";
    this.categories = this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored categories:", error);
      }
    }
    // Initialize with default data if nothing in storage
    const defaultCategories = [...categoriesData];
    this.saveToStorage(defaultCategories);
    return defaultCategories;
  }

  saveToStorage(categories) {
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.categories];
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await this.delay();
    const maxId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.Id)) : 0;
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || "#6366F1",
      taskCount: 0
    };
    
    this.categories.push(newCategory);
    this.saveToStorage(this.categories);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedCategory = {
      ...this.categories[index],
      ...categoryData,
      Id: parseInt(id) // Ensure Id doesn't change
    };
    
    this.categories[index] = updatedCategory;
    this.saveToStorage(this.categories);
    return { ...updatedCategory };
  }

  async delete(id) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    this.saveToStorage(this.categories);
    return true;
  }

  async updateTaskCount(categoryName, count) {
    await this.delay();
    const category = this.categories.find(c => c.name === categoryName);
    if (category) {
      category.taskCount = count;
      this.saveToStorage(this.categories);
      return { ...category };
    }
    return null;
  }
}

export default new CategoryService();