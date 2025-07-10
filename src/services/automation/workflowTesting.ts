
import { logger } from '@/utils/logger';

export interface TestContext {
  leadId: string;
  name: string;
  email: string;
  phone?: string;
  score: number;
  tags: string[];
  stage?: string;
  lastContact?: Date;
}

export interface TestResult {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  data?: any;
  executionTime?: number;
}

export class WorkflowTestingService {
  async testTrigger(config: any, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      switch (config.triggerType) {
        case 'form_submitted':
          return {
            nodeId: '',
            nodeType: 'trigger',
            nodeTitle: 'Form Submitted',
            status: 'success',
            message: 'Form submission trigger activated',
            executionTime: Date.now() - startTime
          };
          
        case 'new_lead_added':
          return {
            nodeId: '',
            nodeType: 'trigger',
            nodeTitle: 'New Lead Added',
            status: 'success',
            message: `New lead trigger for ${context.name}`,
            executionTime: Date.now() - startTime
          };
          
        case 'tag_applied':
          const hasRequiredTag = context.tags.includes(config.requiredTag || 'interested');
          return {
            nodeId: '',
            nodeType: 'trigger',
            nodeTitle: 'Tag Applied',
            status: hasRequiredTag ? 'success' : 'failed',
            message: hasRequiredTag 
              ? `Tag trigger activated for tag: ${config.requiredTag || 'interested'}`
              : `Required tag not found: ${config.requiredTag || 'interested'}`,
            executionTime: Date.now() - startTime
          };
          
        default:
          return {
            nodeId: '',
            nodeType: 'trigger',
            nodeTitle: 'Unknown Trigger',
            status: 'success',
            message: 'Generic trigger activated',
            executionTime: Date.now() - startTime
          };
      }
    } catch (error) {
      logger.error('Trigger test failed:', error);
      return {
        nodeId: '',
        nodeType: 'trigger',
        nodeTitle: 'Trigger Error',
        status: 'failed',
        message: `Trigger test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  async testCondition(config: any, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      switch (config.conditionType) {
        case 'has_tag':
          const hasTag = context.tags.includes(config.conditionValue || 'interested');
          return {
            nodeId: '',
            nodeType: 'condition',
            nodeTitle: 'Has Tag',
            status: hasTag ? 'success' : 'failed',
            message: hasTag 
              ? `Contact has tag: ${config.conditionValue || 'interested'}`
              : `Contact missing tag: ${config.conditionValue || 'interested'}`,
            executionTime: Date.now() - startTime
          };
          
        case 'field_equals':
          const fieldValue = (context as any)[config.fieldName] || '';
          const matches = fieldValue.toString() === config.conditionValue;
          return {
            nodeId: '',
            nodeType: 'condition',
            nodeTitle: 'Field Equals',
            status: matches ? 'success' : 'failed',
            message: matches 
              ? `Field ${config.fieldName} equals ${config.conditionValue}`
              : `Field ${config.fieldName} (${fieldValue}) does not equal ${config.conditionValue}`,
            executionTime: Date.now() - startTime
          };
          
        case 'lead_score_above':
          const scoreThreshold = parseInt(config.conditionValue) || 50;
          const scoreAbove = context.score > scoreThreshold;
          return {
            nodeId: '',
            nodeType: 'condition',
            nodeTitle: 'Lead Score Above',
            status: scoreAbove ? 'success' : 'failed',
            message: scoreAbove 
              ? `Lead score ${context.score} is above ${scoreThreshold}`
              : `Lead score ${context.score} is not above ${scoreThreshold}`,
            executionTime: Date.now() - startTime
          };
          
        case 'lead_score_below':
          const scoreBelowThreshold = parseInt(config.conditionValue) || 50;
          const scoreBelow = context.score < scoreBelowThreshold;
          return {
            nodeId: '',
            nodeType: 'condition',
            nodeTitle: 'Lead Score Below',
            status: scoreBelow ? 'success' : 'failed',
            message: scoreBelow 
              ? `Lead score ${context.score} is below ${scoreBelowThreshold}`
              : `Lead score ${context.score} is not below ${scoreBelowThreshold}`,
            executionTime: Date.now() - startTime
          };
          
        default:
          return {
            nodeId: '',
            nodeType: 'condition',
            nodeTitle: 'Unknown Condition',
            status: 'success',
            message: 'Generic condition passed',
            executionTime: Date.now() - startTime
          };
      }
    } catch (error) {
      logger.error('Condition test failed:', error);
      return {
        nodeId: '',
        nodeType: 'condition',
        nodeTitle: 'Condition Error',
        status: 'failed',
        message: `Condition test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  async testAction(config: any, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      switch (config.actionType) {
        case 'send_email':
          return {
            nodeId: '',
            nodeType: 'action',
            nodeTitle: 'Send Email',
            status: 'success',
            message: `Email would be sent to ${context.email}`,
            data: {
              to: context.email,
              subject: `Email for ${context.name}`,
              content: config.emailContent || 'Default email content'
            },
            executionTime: Date.now() - startTime
          };
          
        case 'apply_tag':
          return {
            nodeId: '',
            nodeType: 'action',
            nodeTitle: 'Apply Tag',
            status: 'success',
            message: `Tag "${config.tagValue || 'new-tag'}" would be applied to ${context.name}`,
            data: {
              leadId: context.leadId,
              tag: config.tagValue || 'new-tag'
            },
            executionTime: Date.now() - startTime
          };
          
        case 'change_stage':
          return {
            nodeId: '',
            nodeType: 'action',
            nodeTitle: 'Change Stage',
            status: 'success',
            message: `Stage would be changed to "${config.stageValue || 'qualified'}" for ${context.name}`,
            data: {
              leadId: context.leadId,
              newStage: config.stageValue || 'qualified',
              oldStage: context.stage || 'new'
            },
            executionTime: Date.now() - startTime
          };
          
        case 'assign_user':
          return {
            nodeId: '',
            nodeType: 'action',
            nodeTitle: 'Assign User',
            status: 'success',
            message: `Lead would be assigned to user: ${config.userId || 'default-user'}`,
            data: {
              leadId: context.leadId,
              assignedTo: config.userId || 'default-user'
            },
            executionTime: Date.now() - startTime
          };
          
        case 'trigger_notification':
          return {
            nodeId: '',
            nodeType: 'action',
            nodeTitle: 'Trigger Notification',
            status: 'success',
            message: `Notification would be sent: ${config.notificationMessage || 'Default notification'}`,
            data: {
              type: 'workflow_notification',
              message: config.notificationMessage || 'Default notification',
              leadId: context.leadId
            },
            executionTime: Date.now() - startTime
          };
          
        default:
          return {
            nodeId: '',
            nodeType: 'action',
            nodeTitle: 'Unknown Action',
            status: 'success',
            message: 'Generic action would be executed',
            executionTime: Date.now() - startTime
          };
      }
    } catch (error) {
      logger.error('Action test failed:', error);
      return {
        nodeId: '',
        nodeType: 'action',
        nodeTitle: 'Action Error',
        status: 'failed',
        message: `Action test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  async testDelay(config: any, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const delayAmount = parseInt(config.delayAmount) || 30;
      const delayUnit = config.delayUnit || 'minutes';
      
      return {
        nodeId: '',
        nodeType: 'delay',
        nodeTitle: 'Delay',
        status: 'success',
        message: `Would wait ${delayAmount} ${delayUnit} before continuing`,
        data: {
          delayAmount,
          delayUnit,
          estimatedWaitTime: this.calculateDelayInMs(delayAmount, delayUnit)
        },
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      logger.error('Delay test failed:', error);
      return {
        nodeId: '',
        nodeType: 'delay',
        nodeTitle: 'Delay Error',
        status: 'failed',
        message: `Delay test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime
      };
    }
  }

  private calculateDelayInMs(amount: number, unit: string): number {
    switch (unit) {
      case 'minutes':
        return amount * 60 * 1000;
      case 'hours':
        return amount * 60 * 60 * 1000;
      case 'days':
        return amount * 24 * 60 * 60 * 1000;
      default:
        return amount * 60 * 1000; // Default to minutes
    }
  }

  async executeWorkflowTest(nodes: any[], connections: any[], context: TestContext): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Find trigger nodes to start execution
    const triggerNodes = nodes.filter(node => node.type === 'trigger');
    
    for (const triggerNode of triggerNodes) {
      const triggerResult = await this.testTrigger(triggerNode.config, context);
      triggerResult.nodeId = triggerNode.id;
      results.push(triggerResult);
      
      if (triggerResult.status === 'failed') {
        continue; // Skip this trigger branch if it failed
      }
      
      // Follow the connection chain from this trigger
      await this.executeNodeChain(triggerNode.id, nodes, connections, context, results);
    }
    
    return results;
  }

  private async executeNodeChain(
    currentNodeId: string, 
    nodes: any[], 
    connections: any[], 
    context: TestContext, 
    results: TestResult[]
  ): Promise<void> {
    // Find connections from current node
    const outgoingConnections = connections.filter(conn => conn.fromNode === currentNodeId);
    
    for (const connection of outgoingConnections) {
      const nextNode = nodes.find(n => n.id === connection.toNode);
      if (!nextNode) continue;
      
      let result: TestResult;
      
      switch (nextNode.type) {
        case 'condition':
          result = await this.testCondition(nextNode.config, context);
          break;
        case 'action':
          result = await this.testAction(nextNode.config, context);
          break;
        case 'delay':
          result = await this.testDelay(nextNode.config, context);
          break;
        default:
          continue;
      }
      
      result.nodeId = nextNode.id;
      results.push(result);
      
      // Continue chain if this node succeeded (or for delays)
      if (result.status === 'success' || nextNode.type === 'delay') {
        await this.executeNodeChain(nextNode.id, nodes, connections, context, results);
      }
      // For conditions that fail, we stop this branch but could continue others
    }
  }
}

export const workflowTestingService = new WorkflowTestingService();
