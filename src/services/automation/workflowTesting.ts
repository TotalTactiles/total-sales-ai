
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  mockData: Record<string, any>;
  expectedOutcome: string;
}

export interface TestResult {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  data: Record<string, any>;
  timestamp: string;
  executionTime: number;
  aiGenerated?: boolean;
}

export interface WorkflowTestResult {
  testId: string;
  workflowId: string;
  scenario: TestScenario;
  results: TestResult[];
  overallStatus: 'passed' | 'failed' | 'partial';
  totalExecutionTime: number;
  startTime: string;
  endTime: string;
}

class WorkflowTestingService {
  private testHistory: WorkflowTestResult[] = [];

  // Generate realistic test scenarios based on user role and workflow type
  generateTestScenarios(workflowNodes: any[], userRole: string): TestScenario[] {
    const scenarios: TestScenario[] = [];

    // Base scenario for all workflows
    scenarios.push({
      id: 'scenario-basic',
      name: 'Happy Path Test',
      description: 'Test workflow with ideal conditions',
      mockData: {
        leadId: 'test-lead-001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        company: 'TechCorp Inc.',
        source: 'website',
        score: 85,
        tags: ['qualified', 'interested'],
        status: 'new',
        createdAt: new Date().toISOString(),
        aiSentiment: 'positive',
        messageContent: 'I am very interested in your product and would like to schedule a demo.',
        userAgent: 'sales-rep-001'
      },
      expectedOutcome: 'All steps should execute successfully'
    });

    // Role-specific scenarios
    if (userRole === 'sales_rep') {
      scenarios.push(
        {
          id: 'scenario-cold-lead',
          name: 'Cold Lead Response',
          description: 'Test with unengaged lead',
          mockData: {
            leadId: 'test-lead-002',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            score: 30,
            tags: ['cold', 'unresponsive'],
            status: 'new',
            aiSentiment: 'neutral',
            messageContent: 'Just browsing.',
            emailOpened: false,
            callScheduled: false
          },
          expectedOutcome: 'Should trigger nurture sequence'
        },
        {
          id: 'scenario-hot-lead',
          name: 'High-Intent Lead',
          description: 'Test with high-value, urgent lead',
          mockData: {
            leadId: 'test-lead-003',
            name: 'Michael Johnson',
            email: 'michael@bigcorp.com',
            score: 95,
            tags: ['hot', 'enterprise', 'urgent'],
            status: 'qualified',
            aiSentiment: 'very_positive',
            messageContent: 'We need to implement this solution ASAP. Budget approved.',
            dealValue: 50000
          },
          expectedOutcome: 'Should notify manager and fast-track'
        }
      );
    }

    if (userRole === 'manager') {
      scenarios.push(
        {
          id: 'scenario-team-alert',
          name: 'Team Performance Alert',
          description: 'Test team-level automation',
          mockData: {
            teamId: 'team-001',
            performanceMetric: 'conversion_rate',
            currentValue: 0.12,
            threshold: 0.15,
            period: 'weekly',
            affectedReps: ['rep-001', 'rep-002', 'rep-003']
          },
          expectedOutcome: 'Should alert team leads and suggest actions'
        },
        {
          id: 'scenario-pipeline-bottleneck',
          name: 'Pipeline Bottleneck Detection',
          description: 'Test pipeline flow automation',
          mockData: {
            stageId: 'demo-scheduled',
            averageTime: 14, // days
            threshold: 7,
            affectedDeals: 15,
            totalValue: 125000
          },
          expectedOutcome: 'Should trigger intervention workflow'
        }
      );
    }

    return scenarios;
  }

  // Execute workflow test with comprehensive monitoring
  async executeWorkflowTest(
    workflowNodes: any[],
    connections: any[],
    scenario: TestScenario,
    userRole: string
  ): Promise<WorkflowTestResult> {
    const startTime = new Date().toISOString();
    const testId = `test-${Date.now()}`;
    const results: TestResult[] = [];
    let totalExecutionTime = 0;

    logger.info('Starting workflow test', { testId, scenario: scenario.name, nodeCount: workflowNodes.length });

    try {
      // Sort nodes by execution order (following connections)
      const executionOrder = this.getExecutionOrder(workflowNodes, connections);
      
      for (const node of executionOrder) {
        const nodeStartTime = Date.now();
        const result = await this.executeNodeTest(node, scenario.mockData, userRole);
        const executionTime = Date.now() - nodeStartTime;
        
        result.executionTime = executionTime;
        totalExecutionTime += executionTime;
        
        results.push(result);

        // Stop execution if critical failure occurs
        if (result.status === 'failed' && node.type === 'trigger') {
          logger.warn('Workflow test stopped due to trigger failure', { testId, nodeId: node.id });
          break;
        }

        // Handle conditional branching
        if (node.type === 'condition' && result.status === 'failed') {
          // Follow the "NO" branch if condition fails
          const noBranchNodes = this.getNodesInBranch(node.id, connections, 'no');
          for (const branchNode of noBranchNodes) {
            const branchResult = await this.executeNodeTest(branchNode, scenario.mockData, userRole);
            branchResult.executionTime = Date.now() - nodeStartTime;
            results.push(branchResult);
          }
          break;
        }

        // Simulate realistic delays between steps
        if (node.type === 'delay') {
          await new Promise(resolve => setTimeout(resolve, Math.min(result.executionTime, 1000)));
        }
      }

      const endTime = new Date().toISOString();
      const overallStatus = this.determineOverallStatus(results);

      const testResult: WorkflowTestResult = {
        testId,
        workflowId: 'test-workflow',
        scenario,
        results,
        overallStatus,
        totalExecutionTime,
        startTime,
        endTime
      };

      this.testHistory.push(testResult);
      logger.info('Workflow test completed', { testId, overallStatus, totalTime: totalExecutionTime });

      return testResult;

    } catch (error) {
      logger.error('Workflow test failed with error', { testId, error });
      throw error;
    }
  }

  // Execute individual node test with realistic simulation
  private async executeNodeTest(
    node: any,
    mockData: Record<string, any>,
    userRole: string
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    const result: TestResult = {
      nodeId: node.id,
      nodeType: node.type,
      nodeTitle: node.title,
      status: 'success',
      message: '',
      data: { ...mockData },
      timestamp: new Date().toISOString(),
      executionTime: 0
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    switch (node.type) {
      case 'trigger':
        result.status = this.testTrigger(node, mockData);
        result.message = result.status === 'success' 
          ? `✅ Trigger activated: ${node.config.triggerType || 'unknown'}`
          : `❌ Trigger failed: ${node.config.triggerType || 'unknown'}`;
        break;

      case 'condition':
        result.status = this.testCondition(node, mockData);
        result.message = result.status === 'success'
          ? `✅ Condition passed: ${node.config.conditionType || 'unknown'}`
          : `❌ Condition failed: ${node.config.conditionType || 'unknown'}`;
        break;

      case 'action':
        const actionResult = await this.testAction(node, mockData, userRole);
        result.status = actionResult.status;
        result.message = actionResult.message;
        result.aiGenerated = actionResult.aiGenerated;
        break;

      case 'ai_action':
        const aiResult = await this.testAIAction(node, mockData);
        result.status = aiResult.status;
        result.message = aiResult.message;
        result.aiGenerated = true;
        break;

      case 'delay':
        result.message = `⏱️ Delay: ${node.config.delayAmount || '30'} ${node.config.delayUnit || 'minutes'}`;
        // Simulate delay validation
        result.status = node.config.delayAmount && node.config.delayUnit ? 'success' : 'failed';
        break;

      default:
        result.status = 'skipped';
        result.message = `⚠️ Unknown node type: ${node.type}`;
    }

    result.executionTime = Date.now() - startTime;
    return result;
  }

  // Test trigger node logic
  private testTrigger(node: any, mockData: Record<string, any>): 'success' | 'failed' {
    const triggerType = node.config.triggerType;
    
    switch (triggerType) {
      case 'form_submitted':
        return mockData.formSubmitted !== false ? 'success' : 'failed';
      
      case 'button_clicked':
        return mockData.buttonClicked !== false ? 'success' : 'failed';
      
      case 'new_lead_added':
        return mockData.leadId ? 'success' : 'failed';
      
      case 'tag_applied':
        return mockData.tags && mockData.tags.length > 0 ? 'success' : 'failed';
      
      case 'ai_assistant_triggered':
        return mockData.aiTriggered !== false ? 'success' : 'failed';
      
      case 'email_opened':
        return mockData.emailOpened !== false ? 'success' : 'failed';
      
      case 'call_scheduled':
        return mockData.callScheduled !== false ? 'success' : 'failed';
      
      default:
        return Math.random() > 0.1 ? 'success' : 'failed'; // 90% success rate for unknown triggers
    }
  }

  // Test condition node logic
  private testCondition(node: any, mockData: Record<string, any>): 'success' | 'failed' {
    const conditionType = node.config.conditionType;
    const conditionValue = node.config.conditionValue;
    
    switch (conditionType) {
      case 'has_tag':
        return mockData.tags && mockData.tags.includes(conditionValue) ? 'success' : 'failed';
      
      case 'field_equals':
        const fieldName = node.config.fieldName || 'status';
        return mockData[fieldName] === conditionValue ? 'success' : 'failed';
      
      case 'lead_score_above':
        return (mockData.score || 0) > parseInt(conditionValue || '50') ? 'success' : 'failed';
      
      case 'lead_score_below':
        return (mockData.score || 0) < parseInt(conditionValue || '50') ? 'success' : 'failed';
      
      case 'ai_sentiment':
        const expectedSentiment = conditionValue || 'positive';
        return mockData.aiSentiment === expectedSentiment ? 'success' : 'failed';
      
      case 'time_condition':
        // Simulate time-based condition (e.g., business hours)
        const currentHour = new Date().getHours();
        return currentHour >= 9 && currentHour <= 17 ? 'success' : 'failed';
      
      case 'message_contains':
        const searchTerm = conditionValue || 'demo';
        return mockData.messageContent && mockData.messageContent.includes(searchTerm) ? 'success' : 'failed';
      
      default:
        return Math.random() > 0.3 ? 'success' : 'failed'; // 70% success rate
    }
  }

  // Test action node with realistic outcomes
  private async testAction(
    node: any, 
    mockData: Record<string, any>, 
    userRole: string
  ): Promise<{ status: 'success' | 'failed'; message: string; aiGenerated?: boolean }> {
    const actionType = node.config.actionType;
    
    switch (actionType) {
      case 'send_email':
        if (!mockData.email) {
          return { status: 'failed', message: '❌ No email address provided' };
        }
        return { 
          status: 'success', 
          message: `✅ Email sent to ${mockData.email}`,
          aiGenerated: node.config.useAI || false
        };
      
      case 'assign_user':
        return { 
          status: 'success', 
          message: `✅ Lead assigned to ${mockData.userAgent || 'default user'}` 
        };
      
      case 'change_stage':
        const newStage = node.config.newStage || 'qualified';
        return { 
          status: 'success', 
          message: `✅ Lead moved to ${newStage} stage` 
        };
      
      case 'apply_tag':
        const tag = node.config.tagName || 'processed';
        return { 
          status: 'success', 
          message: `✅ Tag "${tag}" applied to lead` 
        };
      
      case 'create_task':
        return { 
          status: 'success', 
          message: `✅ Task created: ${node.config.taskDescription || 'Follow up with lead'}`,
          aiGenerated: node.config.useAI || false
        };
      
      case 'ai_auto_reply':
        if (!mockData.messageContent) {
          return { status: 'failed', message: '❌ No message to reply to' };
        }
        return { 
          status: 'success', 
          message: `🤖 AI auto-reply generated for message from ${mockData.name}`,
          aiGenerated: true
        };
      
      case 'ai_lead_scoring':
        const newScore = Math.min(100, (mockData.score || 50) + Math.floor(Math.random() * 20) - 10);
        return { 
          status: 'success', 
          message: `🤖 AI lead score updated: ${mockData.score || 'unknown'} → ${newScore}`,
          aiGenerated: true
        };
      
      case 'schedule_call':
        return { 
          status: 'success', 
          message: `📞 Call scheduled for ${mockData.name}` 
        };
      
      case 'send_sms':
        if (!mockData.phone) {
          return { status: 'failed', message: '❌ No phone number provided' };
        }
        return { 
          status: 'success', 
          message: `📱 SMS sent to ${mockData.phone}` 
        };
      
      case 'webhook':
        return { 
          status: 'success', 
          message: `🔗 Webhook called: ${node.config.webhookUrl || 'default endpoint'}` 
        };
      
      case 'crm_sync':
        return { 
          status: 'success', 
          message: `🔄 Data synced to CRM: ${node.config.crmType || 'default'}` 
        };
      
      default:
        return { 
          status: 'failed', 
          message: `❓ Unknown action type: ${actionType}` 
        };
    }
  }

  // Test AI action nodes
  private async testAIAction(
    node: any, 
    mockData: Record<string, any>
  ): Promise<{ status: 'success' | 'failed'; message: string }> {
    const actionType = node.config.actionType;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    switch (actionType) {
      case 'ai_draft_reply':
        return { 
          status: 'success', 
          message: `🤖 AI drafted personalized reply for ${mockData.name}` 
        };
      
      case 'ai_call_summary':
        return { 
          status: 'success', 
          message: `🤖 AI generated call summary (${mockData.callDuration || 15} min call)` 
        };
      
      case 'ai_objection_handler':
        const objectionType = ['price', 'timing', 'features', 'competitor'][Math.floor(Math.random() * 4)];
        return { 
          status: 'success', 
          message: `🤖 AI classified objection: ${objectionType} - Response suggested` 
        };
      
      case 'ai_lead_insights':
        const insights = ['High buying intent', 'Budget confirmed', 'Decision maker identified', 'Timeline urgent'];
        const insight = insights[Math.floor(Math.random() * insights.length)];
        return { 
          status: 'success', 
          message: `🤖 AI insight: ${insight}` 
        };
      
      case 'ai_next_best_action':
        const actions = ['Schedule demo', 'Send pricing', 'Connect with decision maker', 'Provide case study'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        return { 
          status: 'success', 
          message: `🤖 AI recommended next action: ${action}` 
        };
      
      default:
        return { 
          status: 'failed', 
          message: `❓ Unknown AI action: ${actionType}` 
        };
    }
  }

  // Helper methods for workflow execution flow
  private getExecutionOrder(nodes: any[], connections: any[]): any[] {
    // Find trigger nodes (starting points)
    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    const executionOrder: any[] = [];
    const visited = new Set<string>();

    for (const trigger of triggerNodes) {
      this.traverseFromNode(trigger, nodes, connections, executionOrder, visited);
    }

    return executionOrder;
  }

  private traverseFromNode(
    currentNode: any, 
    allNodes: any[], 
    connections: any[], 
    executionOrder: any[], 
    visited: Set<string>
  ) {
    if (visited.has(currentNode.id)) return;
    
    visited.add(currentNode.id);
    executionOrder.push(currentNode);

    // Find connected nodes
    const outgoingConnections = connections.filter(c => c.fromNode === currentNode.id);
    
    for (const connection of outgoingConnections) {
      const nextNode = allNodes.find(n => n.id === connection.toNode);
      if (nextNode) {
        this.traverseFromNode(nextNode, allNodes, connections, executionOrder, visited);
      }
    }
  }

  private getNodesInBranch(nodeId: string, connections: any[], branchType: 'yes' | 'no'): any[] {
    // Implementation for getting nodes in specific branch
    return connections
      .filter(c => c.fromNode === nodeId && c.branchType === branchType)
      .map(c => c.toNode);
  }

  private determineOverallStatus(results: TestResult[]): 'passed' | 'failed' | 'partial' {
    const successCount = results.filter(r => r.status === 'success').length;
    const failureCount = results.filter(r => r.status === 'failed').length;
    
    if (failureCount === 0) return 'passed';
    if (successCount === 0) return 'failed';
    return 'partial';
  }

  // Get test history for analytics
  getTestHistory(): WorkflowTestResult[] {
    return [...this.testHistory];
  }

  // Clear test history
  clearTestHistory(): void {
    this.testHistory = [];
  }
}

export const workflowTestingService = new WorkflowTestingService();
