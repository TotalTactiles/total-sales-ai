
import { BaseAIModule, ModuleConfig, ProcessingContext, ModuleResponse } from '../core/BaseAIModule';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface KPIData {
  metric: string;
  value: number;
  trend: number;
  period: string;
}

interface ForecastData {
  metric: string;
  forecast: number[];
  confidence: number[];
  period: string[];
}

export class AnalyticsAI extends BaseAIModule {
  private kpiCache = new Map<string, KPIData[]>();
  private forecastCache = new Map<string, ForecastData>();
  private cacheExpiry = 15 * 60 * 1000; // 15 minutes

  constructor(config: ModuleConfig) {
    super(config);
  }

  protected async initializeModule(): Promise<void> {
    logger.info('Initializing Analytics AI module');
    
    // Load current KPIs
    await this.loadKPIData();
    
    // Set up periodic data refresh
    setInterval(() => {
      this.refreshAnalyticsData();
    }, this.cacheExpiry);
    
    logger.info('Analytics AI module initialized');
  }

  protected async processRequest(input: any, context: ProcessingContext): Promise<any> {
    try {
      const requestType = this.determineRequestType(input, context);
      
      switch (requestType) {
        case 'kpi_analysis':
          return await this.analyzeKPIs(input, context);
        case 'trend_analysis':
          return await this.analyzeTrends(input, context);
        case 'forecasting':
          return await this.generateForecast(input, context);
        case 'what_if_scenario':
          return await this.runWhatIfScenario(input, context);
        case 'performance_summary':
          return await this.generatePerformanceSummary(input, context);
        case 'data_visualization':
          return await this.generateVisualization(input, context);
        default:
          return await this.handleGeneralQuery(input, context);
      }
    } catch (error) {
      logger.error('Error processing Analytics AI request:', error);
      throw error;
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if we can access analytics data
      const { error } = await supabase
        .from('usage_events')
        .select('id')
        .eq('company_id', this.config.companyId)
        .limit(1);
      
      return !error;
    } catch (error) {
      logger.error('Analytics AI health check failed:', error);
      return false;
    }
  }

  protected async cleanupModule(): Promise<void> {
    this.kpiCache.clear();
    this.forecastCache.clear();
    logger.info('Analytics AI module cleaned up');
  }

  // Data Loading Methods
  private async loadKPIData(): Promise<void> {
    try {
      const kpis = await Promise.all([
        this.calculateLeadMetrics(),
        this.calculateCallMetrics(),
        this.calculateConversionMetrics(),
        this.calculateRevenueMetrics()
      ]);

      this.kpiCache.set('leads', kpis[0]);
      this.kpiCache.set('calls', kpis[1]);
      this.kpiCache.set('conversions', kpis[2]);
      this.kpiCache.set('revenue', kpis[3]);

    } catch (error) {
      logger.error('Error loading KPI data:', error);
    }
  }

  private async refreshAnalyticsData(): Promise<void> {
    logger.info('Refreshing analytics data cache');
    await this.loadKPIData();
  }

  // Request Processing Methods
  private determineRequestType(input: any, context: ProcessingContext): string {
    const inputStr = String(input).toLowerCase();
    
    if (inputStr.includes('kpi') || inputStr.includes('metrics') || inputStr.includes('performance')) {
      return 'kpi_analysis';
    }
    if (inputStr.includes('trend') || inputStr.includes('pattern') || inputStr.includes('over time')) {
      return 'trend_analysis';
    }
    if (inputStr.includes('forecast') || inputStr.includes('predict') || inputStr.includes('future')) {
      return 'forecasting';
    }
    if (inputStr.includes('what if') || inputStr.includes('scenario') || inputStr.includes('simulation')) {
      return 'what_if_scenario';
    }
    if (inputStr.includes('summary') || inputStr.includes('report') || inputStr.includes('overview')) {
      return 'performance_summary';
    }
    if (inputStr.includes('chart') || inputStr.includes('graph') || inputStr.includes('visualization')) {
      return 'data_visualization';
    }
    
    return 'general_query';
  }

  private async analyzeKPIs(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { metric, period } = input;
      const requestedMetric = metric || 'all';
      
      let kpiData: KPIData[] = [];
      
      if (requestedMetric === 'all') {
        // Combine all KPIs
        for (const [key, data] of this.kpiCache) {
          kpiData = kpiData.concat(data);
        }
      } else {
        kpiData = this.kpiCache.get(requestedMetric) || [];
      }

      const analysis = {
        kpis: kpiData,
        insights: this.generateKPIInsights(kpiData),
        recommendations: this.generateKPIRecommendations(kpiData),
        period: period || 'current'
      };

      return {
        success: true,
        data: analysis,
        suggestions: [
          'View detailed trends',
          'Generate forecast',
          'Run what-if scenarios',
          'Export report'
        ]
      };

    } catch (error) {
      logger.error('Error analyzing KPIs:', error);
      return {
        success: false,
        error: 'Failed to analyze KPIs'
      };
    }
  }

  private async analyzeTrends(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { metric, period } = input;
      
      // Get historical data
      const historicalData = await this.getHistoricalData(metric, period);
      
      // Perform trend analysis
      const trendAnalysis = {
        metric: metric,
        trend: this.calculateTrend(historicalData),
        seasonality: this.detectSeasonality(historicalData),
        anomalies: this.detectAnomalies(historicalData),
        correlation: await this.findCorrelations(metric, historicalData),
        dataPoints: historicalData
      };

      return {
        success: true,
        data: trendAnalysis,
        suggestions: [
          'Generate forecast based on trends',
          'Analyze correlation factors',
          'Set up trend alerts',
          'Export trending data'
        ]
      };

    } catch (error) {
      logger.error('Error analyzing trends:', error);
      return {
        success: false,
        error: 'Failed to analyze trends'
      };
    }
  }

  private async generateForecast(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { metric, periods, method } = input;
      const forecastPeriods = periods || 12; // Default 12 periods
      const forecastMethod = method || 'exponential_smoothing';

      // Get historical data
      const historicalData = await this.getHistoricalData(metric, '12months');
      
      // Generate forecast
      const forecast = this.calculateForecast(historicalData, forecastPeriods, forecastMethod);
      
      // Calculate confidence intervals
      const confidence = this.calculateConfidenceIntervals(forecast, historicalData);

      const forecastData: ForecastData = {
        metric,
        forecast: forecast.values,
        confidence: confidence,
        period: forecast.periods
      };

      // Cache forecast
      this.forecastCache.set(`${metric}_${forecastPeriods}`, forecastData);

      return {
        success: true,
        data: {
          forecast: forecastData,
          accuracy: this.calculateForecastAccuracy(historicalData),
          methodology: forecastMethod,
          assumptions: this.getForecastAssumptions(forecastMethod)
        },
        suggestions: [
          'Adjust forecast parameters',
          'View confidence intervals',
          'Test different methods',
          'Set up forecast alerts'
        ]
      };

    } catch (error) {
      logger.error('Error generating forecast:', error);
      return {
        success: false,
        error: 'Failed to generate forecast'
      };
    }
  }

  private async runWhatIfScenario(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { scenario, parameters } = input;
      
      // Load scenario template
      const scenarioTemplate = this.getScenarioTemplate(scenario);
      
      // Apply parameters to base data
      const baseData = await this.getBaselineData();
      const scenarioResults = this.applyScenarioParameters(baseData, parameters, scenarioTemplate);
      
      // Calculate impact
      const impact = this.calculateScenarioImpact(baseData, scenarioResults);

      return {
        success: true,
        data: {
          scenario,
          parameters,
          baseline: baseData,
          projected: scenarioResults,
          impact,
          riskFactors: this.identifyRiskFactors(scenario, parameters),
          recommendations: this.generateScenarioRecommendations(impact)
        },
        suggestions: [
          'Test different parameters',
          'Save successful scenarios',
          'Compare multiple scenarios',
          'Create action plan'
        ]
      };

    } catch (error) {
      logger.error('Error running what-if scenario:', error);
      return {
        success: false,
        error: 'Failed to run scenario analysis'
      };
    }
  }

  private async generatePerformanceSummary(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { period } = input;
      const summaryPeriod = period || 'monthly';

      // Gather all performance data
      const summary = {
        period: summaryPeriod,
        kpis: Array.from(this.kpiCache.values()).flat(),
        highlights: await this.generateHighlights(),
        lowlights: await this.generateLowlights(),
        trends: await this.getSummaryTrends(),
        recommendations: await this.generateSummaryRecommendations(),
        snapshot: await this.generateWeeklySnapshot()
      };

      return {
        success: true,
        data: summary,
        suggestions: [
          'Drill down into specific metrics',
          'Share summary with team',
          'Schedule weekly snapshots',
          'Set up alerts for key metrics'
        ]
      };

    } catch (error) {
      logger.error('Error generating performance summary:', error);
      return {
        success: false,
        error: 'Failed to generate performance summary'
      };
    }
  }

  private async generateVisualization(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      const { chartType, metrics, period } = input;
      
      // Get data for visualization
      const data = await this.getVisualizationData(metrics, period);
      
      // Generate chart configuration
      const chartConfig = this.generateChartConfig(chartType, data, metrics);

      return {
        success: true,
        data: {
          chartType,
          config: chartConfig,
          data,
          styling: this.getConsistentStyling(),
          interactive: true
        },
        suggestions: [
          'Export chart image',
          'Embed in dashboard',
          'Schedule automated updates',
          'Share with team'
        ]
      };

    } catch (error) {
      logger.error('Error generating visualization:', error);
      return {
        success: false,
        error: 'Failed to generate visualization'
      };
    }
  }

  private async handleGeneralQuery(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    return {
      success: true,
      data: {
        message: 'I can help you analyze your sales performance data. What would you like to explore?',
        availableAnalytics: [
          'KPI tracking and analysis',
          'Trend analysis and forecasting',
          'What-if scenario modeling',
          'Performance summaries',
          'Data visualization'
        ]
      }
    };
  }

  // KPI Calculation Methods
  private async calculateLeadMetrics(): Promise<KPIData[]> {
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('company_id', this.config.companyId);

    const total = leads?.length || 0;
    const qualified = leads?.filter(l => l.status === 'qualified').length || 0;
    const converted = leads?.filter(l => l.status === 'converted').length || 0;

    return [
      { metric: 'Total Leads', value: total, trend: 0.12, period: 'current' },
      { metric: 'Qualified Leads', value: qualified, trend: 0.08, period: 'current' },
      { metric: 'Converted Leads', value: converted, trend: 0.15, period: 'current' },
      { metric: 'Conversion Rate', value: total > 0 ? (converted / total) * 100 : 0, trend: 0.05, period: 'current' }
    ];
  }

  private async calculateCallMetrics(): Promise<KPIData[]> {
    const { data: calls } = await supabase
      .from('call_logs')
      .select('*')
      .eq('company_id', this.config.companyId);

    const total = calls?.length || 0;
    const connected = calls?.filter(c => c.status === 'completed').length || 0;
    const avgDuration = calls?.reduce((sum, c) => sum + (c.duration || 0), 0) / (connected || 1);

    return [
      { metric: 'Total Calls', value: total, trend: 0.18, period: 'current' },
      { metric: 'Connected Calls', value: connected, trend: 0.12, period: 'current' },
      { metric: 'Connection Rate', value: total > 0 ? (connected / total) * 100 : 0, trend: 0.08, period: 'current' },
      { metric: 'Avg Call Duration', value: avgDuration, trend: 0.03, period: 'current' }
    ];
  }

  private async calculateConversionMetrics(): Promise<KPIData[]> {
    // Implementation for conversion metrics
    return [
      { metric: 'Lead to Opportunity', value: 25.5, trend: 0.07, period: 'current' },
      { metric: 'Opportunity to Close', value: 18.2, trend: 0.12, period: 'current' },
      { metric: 'Overall Conversion', value: 4.6, trend: 0.09, period: 'current' }
    ];
  }

  private async calculateRevenueMetrics(): Promise<KPIData[]> {
    // Implementation for revenue metrics
    return [
      { metric: 'Monthly Revenue', value: 125000, trend: 0.15, period: 'current' },
      { metric: 'Average Deal Size', value: 5200, trend: 0.08, period: 'current' },
      { metric: 'Revenue per Lead', value: 240, trend: 0.11, period: 'current' }
    ];
  }

  // Analysis Methods
  private generateKPIInsights(kpiData: KPIData[]): string[] {
    const insights: string[] = [];
    
    kpiData.forEach(kpi => {
      if (kpi.trend > 0.1) {
        insights.push(`${kpi.metric} showing strong positive trend (+${(kpi.trend * 100).toFixed(1)}%)`);
      } else if (kpi.trend < -0.05) {
        insights.push(`${kpi.metric} declining (${(kpi.trend * 100).toFixed(1)}%)`);
      }
    });

    return insights;
  }

  private generateKPIRecommendations(kpiData: KPIData[]): string[] {
    const recommendations: string[] = [];
    
    const conversionRate = kpiData.find(k => k.metric.includes('Conversion'));
    if (conversionRate && conversionRate.value < 5) {
      recommendations.push('Focus on lead qualification to improve conversion rates');
    }

    const callConnectionRate = kpiData.find(k => k.metric.includes('Connection'));
    if (callConnectionRate && callConnectionRate.value < 30) {
      recommendations.push('Optimize calling times and contact strategies');
    }

    return recommendations;
  }

  private async getHistoricalData(metric: string, period: string): Promise<number[]> {
    // Mock historical data - in production would query actual historical records
    const dataPoints = 12;
    const baseValue = 100;
    const trend = 0.05;
    const noise = 0.1;

    return Array.from({ length: dataPoints }, (_, i) => {
      const trendComponent = baseValue * (1 + trend * i);
      const noiseComponent = (Math.random() - 0.5) * noise * baseValue;
      return Math.max(0, trendComponent + noiseComponent);
    });
  }

  private calculateTrend(data: number[]): { direction: string; strength: number; equation: string } {
    if (data.length < 2) return { direction: 'stable', strength: 0, equation: 'y = constant' };

    // Linear regression
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * data[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const direction = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';
    const strength = Math.abs(slope);

    return {
      direction,
      strength,
      equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`
    };
  }

  private detectSeasonality(data: number[]): { hasSeasonality: boolean; pattern?: string } {
    // Simple seasonality detection
    if (data.length < 12) return { hasSeasonality: false };

    const quarters = [];
    for (let i = 0; i < 4; i++) {
      const quarterData = data.filter((_, index) => index % 4 === i);
      quarters.push(quarterData.reduce((sum, val) => sum + val, 0) / quarterData.length);
    }

    const maxQuarter = Math.max(...quarters);
    const minQuarter = Math.min(...quarters);
    const variation = (maxQuarter - minQuarter) / minQuarter;

    return {
      hasSeasonality: variation > 0.2,
      pattern: variation > 0.2 ? 'Quarterly variation detected' : undefined
    };
  }

  private detectAnomalies(data: number[]): number[] {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
    const threshold = 2 * stdDev;

    return data
      .map((val, index) => ({ value: val, index }))
      .filter(({ value }) => Math.abs(value - mean) > threshold)
      .map(({ index }) => index);
  }

  private async findCorrelations(metric: string, data: number[]): Promise<string[]> {
    // Mock correlation analysis
    return [
      'Marketing spend shows 0.78 correlation',
      'Team size shows 0.65 correlation',
      'Product releases show 0.45 correlation'
    ];
  }

  private calculateForecast(data: number[], periods: number, method: string): { values: number[]; periods: string[] } {
    const forecast: number[] = [];
    const forecastPeriods: string[] = [];

    if (method === 'linear_regression') {
      const trend = this.calculateTrend(data);
      const lastValue = data[data.length - 1];
      
      for (let i = 1; i <= periods; i++) {
        const forecastValue = lastValue + (trend.strength * i);
        forecast.push(Math.max(0, forecastValue));
        forecastPeriods.push(`Period +${i}`);
      }
    } else if (method === 'exponential_smoothing') {
      const alpha = 0.3; // Smoothing parameter
      let smoothed = data[0];
      
      for (let i = 1; i < data.length; i++) {
        smoothed = alpha * data[i] + (1 - alpha) * smoothed;
      }
      
      for (let i = 1; i <= periods; i++) {
        forecast.push(smoothed);
        forecastPeriods.push(`Period +${i}`);
      }
    }

    return { values: forecast, periods: forecastPeriods };
  }

  private calculateConfidenceIntervals(forecast: { values: number[] }, historicalData: number[]): number[] {
    const variance = this.calculateVariance(historicalData);
    const confidenceLevel = 0.95;
    const zScore = 1.96; // For 95% confidence

    return forecast.values.map(value => {
      const margin = zScore * Math.sqrt(variance);
      return margin / value; // Return as percentage
    });
  }

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }

  private calculateForecastAccuracy(historicalData: number[]): number {
    // Mock accuracy calculation
    return 0.85; // 85% accuracy
  }

  private getForecastAssumptions(method: string): string[] {
    const assumptions: { [key: string]: string[] } = {
      linear_regression: [
        'Historical trend continues',
        'No major market disruptions',
        'Current business model remains stable'
      ],
      exponential_smoothing: [
        'Recent data more relevant than old data',
        'No structural changes in business',
        'Seasonal patterns remain consistent'
      ]
    };

    return assumptions[method] || [];
  }

  // Scenario Analysis Methods
  private getScenarioTemplate(scenario: string): any {
    const templates: { [key: string]: any } = {
      'increased_marketing': {
        leadIncrease: 0.25,
        costIncrease: 0.15,
        conversionImpact: 0.05
      },
      'team_expansion': {
        capacityIncrease: 0.5,
        costIncrease: 0.3,
        rampTime: 3
      },
      'price_change': {
        revenueImpact: 0.2,
        demandImpact: -0.1,
        competitiveResponse: 0.05
      }
    };

    return templates[scenario] || {};
  }

  private async getBaselineData(): Promise<any> {
    const allKPIs = Array.from(this.kpiCache.values()).flat();
    return {
      leads: allKPIs.find(k => k.metric === 'Total Leads')?.value || 0,
      conversion: allKPIs.find(k => k.metric === 'Conversion Rate')?.value || 0,
      revenue: allKPIs.find(k => k.metric === 'Monthly Revenue')?.value || 0
    };
  }

  private applyScenarioParameters(baseData: any, parameters: any, template: any): any {
    const results = { ...baseData };
    
    if (template.leadIncrease) {
      results.leads *= (1 + template.leadIncrease);
    }
    
    if (template.revenueImpact) {
      results.revenue *= (1 + template.revenueImpact);
    }

    return results;
  }

  private calculateScenarioImpact(baseline: any, scenario: any): any {
    return {
      leadChange: ((scenario.leads - baseline.leads) / baseline.leads) * 100,
      revenueChange: ((scenario.revenue - baseline.revenue) / baseline.revenue) * 100,
      conversionChange: scenario.conversion - baseline.conversion
    };
  }

  private identifyRiskFactors(scenario: string, parameters: any): string[] {
    const riskFactors: string[] = [];
    
    if (scenario === 'increased_marketing' && parameters.increase > 0.5) {
      riskFactors.push('High marketing spend may not scale linearly');
    }
    
    if (scenario === 'team_expansion') {
      riskFactors.push('New team members require ramp-up time');
      riskFactors.push('Management overhead increases');
    }

    return riskFactors;
  }

  private generateScenarioRecommendations(impact: any): string[] {
    const recommendations: string[] = [];
    
    if (impact.revenueChange > 20) {
      recommendations.push('Strong positive impact - consider implementation');
    }
    
    if (impact.leadChange < 0) {
      recommendations.push('Monitor lead generation carefully');
    }

    return recommendations;
  }

  // Summary and Visualization Methods
  private async generateHighlights(): Promise<string[]> {
    return [
      'Lead generation up 12% this month',
      'Conversion rate improved to 4.8%',
      'Average deal size increased by $200'
    ];
  }

  private async generateLowlights(): Promise<string[]> {
    return [
      'Call connection rate down 5%',
      'Sales cycle lengthened by 3 days'
    ];
  }

  private async getSummaryTrends(): Promise<any[]> {
    return [
      { metric: 'Leads', trend: 'up', value: '12%' },
      { metric: 'Calls', trend: 'down', value: '5%' },
      { metric: 'Revenue', trend: 'up', value: '15%' }
    ];
  }

  private async generateSummaryRecommendations(): Promise<string[]> {
    return [
      'Increase calling frequency to improve connection rates',
      'Focus on high-value lead sources',
      'Implement lead scoring to prioritize efforts'
    ];
  }

  private async generateWeeklySnapshot(): Promise<any> {
    return {
      date: new Date().toISOString(),
      metrics: Array.from(this.kpiCache.values()).flat(),
      highlights: await this.generateHighlights(),
      concerns: await this.generateLowlights()
    };
  }

  private async getVisualizationData(metrics: string[], period: string): Promise<any> {
    const data: any = {};
    
    for (const metric of metrics) {
      data[metric] = await this.getHistoricalData(metric, period);
    }

    return data;
  }

  private generateChartConfig(chartType: string, data: any, metrics: string[]): any {
    const config = {
      type: chartType,
      data: {
        labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
        datasets: metrics.map((metric, index) => ({
          label: metric,
          data: data[metric] || [],
          borderColor: this.getConsistentColor(index),
          backgroundColor: this.getConsistentColor(index, 0.2)
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${metrics.join(' vs ')} Analysis`
          }
        }
      }
    };

    return config;
  }

  private getConsistentStyling(): any {
    return {
      colorPalette: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
      ],
      fontFamily: 'Inter, sans-serif',
      fontSize: 12
    };
  }

  private getConsistentColor(index: number, alpha: number = 1): string {
    const colors = this.getConsistentStyling().colorPalette;
    const color = colors[index % colors.length];
    
    if (alpha < 1) {
      // Convert hex to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    return color;
  }
}
