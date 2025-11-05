import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    this.tableName = 'category_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error.message);
      toast.error("Failed to load categories");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const payload = {
        records: [{
          name_c: categoryData.name_c || categoryData.name,
          color_c: categoryData.color_c || categoryData.color || "#6366F1",
          task_count_c: 0
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} category records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Category created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error.message);
      toast.error("Failed to create category");
      return null;
    }
  }

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: categoryData.name_c || categoryData.name,
          color_c: categoryData.color_c || categoryData.color,
          task_count_c: categoryData.task_count_c || categoryData.taskCount
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} category records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Category updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error.message);
      toast.error("Failed to update category");
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} category records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Category deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete category");
      return false;
    }
  }

  async updateTaskCount(categoryName, count) {
    try {
      // First find the category by name
      const categories = await this.getAll();
      const category = categories.find(c => (c.name_c || c.Name) === categoryName);
      
      if (!category) {
        return null;
      }

      // Update the task count
      const updatedCategory = await this.update(category.Id, {
        task_count_c: count
      });

      return updatedCategory;
    } catch (error) {
      console.error("Error updating task count:", error?.response?.data?.message || error.message);
      return null;
    }
  }
}

export default new CategoryService();