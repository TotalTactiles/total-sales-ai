
import { clickUpAuth } from './auth';
import { ClickUpErrorHandler } from './errorHandler';

export interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: {
    status: string;
    color: string;
  };
  assignees: Array<{
    id: string;
    username: string;
    email: string;
  }>;
  creator: {
    id: string;
    username: string;
    email: string;
  };
  custom_fields: Array<{
    id: string;
    name: string;
    value?: any;
    type: string;
  }>;
  tags: string[];
  priority?: {
    priority: string;
    color: string;
  };
  date_created: string;
  date_updated: string;
  url: string;
}

export interface ClickUpList {
  id: string;
  name: string;
  content: string;
  status: {
    status: string;
    color: string;
  };
  priority?: {
    priority: string;
    color: string;
  };
  assignee?: {
    id: string;
    username: string;
    email: string;
  };
  task_count: number;
  due_date?: string;
  start_date?: string;
  folder: {
    id: string;
    name: string;
  };
  space: {
    id: string;
    name: string;
  };
}

export interface ClickUpAPIResponse<T> {
  tasks?: T[];
  lists?: T[];
  last_page?: boolean;
}

export class ClickUpAPI {
  private static instance: ClickUpAPI;
  private baseUrl = 'https://api.clickup.com/api/v2';
  private errorHandler = new ClickUpErrorHandler();

  static getInstance(): ClickUpAPI {
    if (!ClickUpAPI.instance) {
      ClickUpAPI.instance = new ClickUpAPI();
    }
    return ClickUpAPI.instance;
  }

  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const accessToken = await clickUpAuth.getValidAccessToken();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': accessToken,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (response.status === 429) {
        await this.handleRateLimit(response);
        return this.makeRequest<T>(endpoint, options);
      }

      if (!response.ok) {
        await this.errorHandler.handleAPIError(response, endpoint);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      await this.errorHandler.logError(error, `API request to ${endpoint}`);
      throw error;
    }
  }

  async getTeams(): Promise<any[]> {
    try {
      const response = await this.makeRequest<{ teams: any[] }>('/team');
      return response.teams || [];
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to fetch ClickUp teams');
      return [];
    }
  }

  async getSpaces(teamId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest<{ spaces: any[] }>(`/team/${teamId}/space`);
      return response.spaces || [];
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to fetch ClickUp spaces for team ${teamId}`);
      return [];
    }
  }

  async getLists(spaceId: string): Promise<ClickUpList[]> {
    try {
      const response = await this.makeRequest<{ lists: ClickUpList[] }>(`/space/${spaceId}/list`);
      return response.lists || [];
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to fetch ClickUp lists for space ${spaceId}`);
      return [];
    }
  }

  async getTasks(listId: string, page: number = 0): Promise<ClickUpTask[]> {
    try {
      const response = await this.makeRequest<ClickUpAPIResponse<ClickUpTask>>(
        `/list/${listId}/task?page=${page}&subtasks=true&include_closed=true`
      );
      return response.tasks || [];
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to fetch ClickUp tasks for list ${listId}`);
      return [];
    }
  }

  async getTask(taskId: string): Promise<ClickUpTask | null> {
    try {
      const response = await this.makeRequest<ClickUpTask>(`/task/${taskId}`);
      return response;
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to fetch ClickUp task ${taskId}`);
      return null;
    }
  }

  async getRecentTasks(listIds: string[], sinceDate?: Date): Promise<ClickUpTask[]> {
    try {
      let allTasks: ClickUpTask[] = [];
      
      for (const listId of listIds) {
        let endpoint = `/list/${listId}/task?subtasks=true&include_closed=true`;
        
        if (sinceDate) {
          const timestamp = sinceDate.getTime();
          endpoint += `&date_updated_gt=${timestamp}`;
        }
        
        const response = await this.makeRequest<ClickUpAPIResponse<ClickUpTask>>(endpoint);
        if (response.tasks) {
          allTasks = allTasks.concat(response.tasks);
        }
      }
      
      return allTasks;
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to fetch recent ClickUp tasks');
      return [];
    }
  }

  async createTask(listId: string, taskData: Partial<ClickUpTask>): Promise<ClickUpTask | null> {
    try {
      const response = await this.makeRequest<ClickUpTask>(`/list/${listId}/task`, {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
      return response;
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to create ClickUp task');
      return null;
    }
  }

  async updateTask(taskId: string, updates: Partial<ClickUpTask>): Promise<ClickUpTask | null> {
    try {
      const response = await this.makeRequest<ClickUpTask>(`/task/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response;
    } catch (error) {
      await this.errorHandler.logError(error, `Failed to update ClickUp task ${taskId}`);
      return null;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.makeRequest<any>('/user');
      return response.user;
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to fetch ClickUp user');
      return null;
    }
  }

  private async handleRateLimit(response: Response): Promise<void> {
    const retryAfter = response.headers.get('Retry-After');
    const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
    
    console.warn(`ClickUp API rate limit hit. Retrying after ${delayMs}ms`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      console.error('ClickUp connection test failed:', error);
      return false;
    }
  }
}

export const clickUpAPI = ClickUpAPI.getInstance();
