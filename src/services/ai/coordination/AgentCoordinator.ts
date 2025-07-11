
import { logger } from '@/utils/logger';
import { aiOrchestrator } from '../orchestration/AIOrchestrator';
import { multiModalProcessor } from '../multimodal/MultiModalProcessor';

interface CoordinationRequest {
  id: string;
  type: 'workflow' | 'parallel' | 'sequential' | 'conditional';
  agents: string[];
  tasks: Array<{
    id: string;
    agentId: string;
    type: string;
    payload: any;
    dependencies?: string[];
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  }>;
  context: {
    userId: string;
    companyId: string;
    sessionId: string;
  };
  timeout?: number;
}

interface CoordinationResult {
  requestId: string;
  success: boolean;
  results: Map<string, any>;
  errors: Map<string, string>;
  executionTime: number;
  coordinationMetrics: {
    tasksCompleted: number;
    tasksTotal: number;
    avgTaskTime: number;
    parallelEfficiency: number;
  };
}

export class AgentCoordinator {
  private static instance: AgentCoordinator;
  private activeCoordinations: Map<string, CoordinationRequest> = new Map();
  private coordinationResults: Map<string, Partial<CoordinationResult>> = new Map();

  static getInstance(): AgentCoordinator {
    if (!AgentCoordinator.instance) {
      AgentCoordinator.instance = new AgentCoordinator();
    }
    return AgentCoordinator.instance;
  }

  async coordinateAgents(request: CoordinationRequest): Promise<CoordinationResult> {
    const startTime = Date.now();
    logger.info(`Starting agent coordination: ${request.type}`, { requestId: request.id }, 'coordinator');

    this.activeCoordinations.set(request.id, request);
    const partialResult: Partial<CoordinationResult> = {
      requestId: request.id,
      results: new Map(),
      errors: new Map()
    };
    this.coordinationResults.set(request.id, partialResult);

    try {
      let result: CoordinationResult;

      switch (request.type) {
        case 'workflow':
          result = await this.executeWorkflow(request);
          break;
        case 'parallel':
          result = await this.executeParallel(request);
          break;
        case 'sequential':
          result = await this.executeSequential(request);
          break;
        case 'conditional':
          result = await this.executeConditional(request);
          break;
        default:
          throw new Error(`Unknown coordination type: ${request.type}`);
      }

      result.executionTime = Date.now() - startTime;
      
      logger.info(`Agent coordination completed: ${request.id}`, {
        success: result.success,
        executionTime: result.executionTime,
        tasksCompleted: result.coordinationMetrics.tasksCompleted
      }, 'coordinator');

      return result;

    } catch (error) {
      logger.error(`Agent coordination failed: ${request.id}`, error, 'coordinator');
      
      return {
        requestId: request.id,
        success: false,
        results: partialResult.results || new Map(),
        errors: partialResult.errors || new Map(),
        executionTime: Date.now() - startTime,
        coordinationMetrics: {
          tasksCompleted: 0,
          tasksTotal: request.tasks.length,
          avgTaskTime: 0,
          parallelEfficiency: 0
        }
      };
    } finally {
      this.activeCoordinations.delete(request.id);
      this.coordinationResults.delete(request.id);
    }
  }

  private async executeWorkflow(request: CoordinationRequest): Promise<CoordinationResult> {
    const results = new Map<string, any>();
    const errors = new Map<string, string>();
    const taskTimes: number[] = [];
    let tasksCompleted = 0;

    // Build dependency graph
    const dependencyGraph = this.buildDependencyGraph(request.tasks);
    const executionOrder = this.topologicalSort(dependencyGraph);

    for (const taskId of executionOrder) {
      const task = request.tasks.find(t => t.id === taskId);
      if (!task) continue;

      try {
        const taskStartTime = Date.now();
        
        // Check if dependencies are satisfied
        if (task.dependencies) {
          const dependenciesMet = task.dependencies.every(depId => results.has(depId));
          if (!dependenciesMet) {
            throw new Error(`Dependencies not met for task: ${taskId}`);
          }
        }

        // Execute task
        const taskResult = await this.executeAgentTask(task, request.context);
        const taskTime = Date.now() - taskStartTime;
        
        results.set(taskId, taskResult);
        taskTimes.push(taskTime);
        tasksCompleted++;

        logger.info(`Task completed: ${taskId}`, { taskTime }, 'coordinator');

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.set(taskId, errorMsg);
        logger.error(`Task failed: ${taskId}`, error, 'coordinator');
      }
    }

    return {
      requestId: request.id,
      success: errors.size === 0,
      results,
      errors,
      executionTime: 0, // Will be set by caller
      coordinationMetrics: {
        tasksCompleted,
        tasksTotal: request.tasks.length,
        avgTaskTime: taskTimes.length > 0 ? taskTimes.reduce((a, b) => a + b, 0) / taskTimes.length : 0,
        parallelEfficiency: this.calculateWorkflowEfficiency(taskTimes, request.tasks.length)
      }
    };
  }

  private async executeParallel(request: CoordinationRequest): Promise<CoordinationResult> {
    const results = new Map<string, any>();
    const errors = new Map<string, string>();
    const startTime = Date.now();

    // Execute all tasks in parallel
    const taskPromises = request.tasks.map(async (task) => {
      try {
        const taskStartTime = Date.now();
        const result = await this.executeAgentTask(task, request.context);
        const taskTime = Date.now() - taskStartTime;
        
        return { taskId: task.id, result, taskTime, success: true };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return { taskId: task.id, error: errorMsg, taskTime: 0, success: false };
      }
    });

    const taskResults = await Promise.allSettled(taskPromises);
    const taskTimes: number[] = [];
    let tasksCompleted = 0;

    taskResults.forEach((promiseResult, index) => {
      if (promiseResult.status === 'fulfilled') {
        const taskResult = promiseResult.value;
        if (taskResult.success) {
          results.set(taskResult.taskId, taskResult.result);
          taskTimes.push(taskResult.taskTime);
          tasksCompleted++;
        } else {
          errors.set(taskResult.taskId, taskResult.error);
        }
      } else {
        errors.set(request.tasks[index].id, promiseResult.reason);
      }
    });

    const totalTime = Date.now() - startTime;
    const avgTaskTime = taskTimes.length > 0 ? taskTimes.reduce((a, b) => a + b, 0) / taskTimes.length : 0;
    const parallelEfficiency = avgTaskTime > 0 ? (avgTaskTime * request.tasks.length) / totalTime : 0;

    return {
      requestId: request.id,
      success: errors.size === 0,
      results,
      errors,
      executionTime: 0, // Will be set by caller
      coordinationMetrics: {
        tasksCompleted,
        tasksTotal: request.tasks.length,
        avgTaskTime,
        parallelEfficiency
      }
    };
  }

  private async executeSequential(request: CoordinationRequest): Promise<CoordinationResult> {
    const results = new Map<string, any>();
    const errors = new Map<string, string>();
    const taskTimes: number[] = [];
    let tasksCompleted = 0;

    for (const task of request.tasks) {
      try {
        const taskStartTime = Date.now();
        const taskResult = await this.executeAgentTask(task, request.context);
        const taskTime = Date.now() - taskStartTime;
        
        results.set(task.id, taskResult);
        taskTimes.push(taskTime);
        tasksCompleted++;

        logger.info(`Sequential task completed: ${task.id}`, { taskTime }, 'coordinator');

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.set(task.id, errorMsg);
        logger.error(`Sequential task failed: ${task.id}`, error, 'coordinator');
        break; // Stop on first error in sequential execution
      }
    }

    return {
      requestId: request.id,
      success: errors.size === 0,
      results,
      errors,
      executionTime: 0, // Will be set by caller
      coordinationMetrics: {
        tasksCompleted,
        tasksTotal: request.tasks.length,
        avgTaskTime: taskTimes.length > 0 ? taskTimes.reduce((a, b) => a + b, 0) / taskTimes.length : 0,
        parallelEfficiency: 1.0 // Sequential is 100% "sequential efficient"
      }
    };
  }

  private async executeConditional(request: CoordinationRequest): Promise<CoordinationResult> {
    const results = new Map<string, any>();
    const errors = new Map<string, string>();
    const taskTimes: number[] = [];
    let tasksCompleted = 0;

    for (const task of request.tasks) {
      try {
        // Check conditions
        if (task.conditions) {
          const conditionsMet = this.evaluateConditions(task.conditions, results);
          if (!conditionsMet) {
            logger.info(`Task skipped due to conditions: ${task.id}`, {}, 'coordinator');
            continue;
          }
        }

        const taskStartTime = Date.now();
        const taskResult = await this.executeAgentTask(task, request.context);
        const taskTime = Date.now() - taskStartTime;
        
        results.set(task.id, taskResult);
        taskTimes.push(taskTime);
        tasksCompleted++;

        logger.info(`Conditional task completed: ${task.id}`, { taskTime }, 'coordinator');

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.set(task.id, errorMsg);
        logger.error(`Conditional task failed: ${task.id}`, error, 'coordinator');
      }
    }

    return {
      requestId: request.id,
      success: errors.size === 0,
      results,
      errors,
      executionTime: 0, // Will be set by caller
      coordinationMetrics: {
        tasksCompleted,
        tasksTotal: request.tasks.length,
        avgTaskTime: taskTimes.length > 0 ? taskTimes.reduce((a, b) => a + b, 0) / taskTimes.length : 0,
        parallelEfficiency: this.calculateConditionalEfficiency(tasksCompleted, request.tasks.length)
      }
    };
  }

  private async executeAgentTask(task: any, context: any): Promise<any> {
    const taskRequest = {
      id: task.id,
      type: task.type,
      priority: 'medium' as const,
      payload: task.payload,
      requiredCapabilities: this.getRequiredCapabilities(task.type),
      context
    };

    const taskId = await aiOrchestrator.submitTask(taskRequest);
    
    // Simulate task execution and return mock result
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    return {
      taskId,
      success: Math.random() > 0.1, // 90% success rate
      result: `Result for task ${task.id}`,
      confidence: 0.8 + Math.random() * 0.15
    };
  }

  private buildDependencyGraph(tasks: any[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    tasks.forEach(task => {
      graph.set(task.id, task.dependencies || []);
    });
    
    return graph;
  }

  private topologicalSort(graph: Map<string, string[]>): string[] {
    const visited = new Set<string>();
    const result: string[] = [];
    
    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      
      visited.add(taskId);
      const dependencies = graph.get(taskId) || [];
      
      dependencies.forEach(depId => {
        if (graph.has(depId)) {
          visit(depId);
        }
      });
      
      result.push(taskId);
    };
    
    Array.from(graph.keys()).forEach(taskId => visit(taskId));
    
    return result;
  }

  private evaluateConditions(conditions: any[], results: Map<string, any>): boolean {
    return conditions.every(condition => {
      const value = results.get(condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'exists':
          return value !== undefined;
        case 'not_exists':
          return value === undefined;
        default:
          return false;
      }
    });
  }

  private getRequiredCapabilities(taskType: string): string[] {
    const capabilityMap: Record<string, string[]> = {
      'speech-to-text': ['speech-to-text'],
      'text-to-speech': ['text-to-speech'],
      'sentiment-analysis': ['sentiment-analysis'],
      'content-generation': ['content-generation'],
      'summarization': ['summarization'],
      'data-analysis': ['data-analysis'],
      'pattern-recognition': ['pattern-recognition']
    };
    
    return capabilityMap[taskType] || ['general-ai'];
  }

  private calculateWorkflowEfficiency(taskTimes: number[], totalTasks: number): number {
    if (taskTimes.length === 0) return 0;
    
    const totalTime = taskTimes.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / taskTimes.length;
    const maxTime = Math.max(...taskTimes);
    
    return avgTime / maxTime; // Efficiency based on time distribution
  }

  private calculateConditionalEfficiency(completedTasks: number, totalTasks: number): number {
    return totalTasks > 0 ? completedTasks / totalTasks : 0;
  }

  async getCoordinationStatus(requestId: string): Promise<Partial<CoordinationResult> | null> {
    return this.coordinationResults.get(requestId) || null;
  }

  async getActiveCoordinations(): Promise<CoordinationRequest[]> {
    return Array.from(this.activeCoordinations.values());
  }
}

export const agentCoordinator = AgentCoordinator.getInstance();
