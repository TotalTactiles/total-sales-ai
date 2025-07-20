
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ToolFormData {
  toolType: string;
  fields: Record<string, any>;
  userId: string;
  companyId: string;
  generatePDF?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { toolType, fields, userId, companyId, generatePDF } = await req.json() as ToolFormData;

    console.log('Processing business ops tool:', { toolType, userId, companyId, generatePDF });

    // Generate preview data based on tool type
    const previewData = await generatePreviewData(toolType, fields);

    // If PDF generation is requested
    if (generatePDF) {
      const pdfContent = await generatePDF(toolType, fields, previewData);
      
      return new Response(pdfContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${toolType}-report.pdf"`
        }
      });
    }

    // Return preview data
    return new Response(
      JSON.stringify({ 
        success: true, 
        previewData,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Business ops tool error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});

async function generatePreviewData(toolType: string, fields: Record<string, any>) {
  console.log(`Generating preview for ${toolType} with fields:`, fields);
  
  switch (toolType) {
    case 'revenue-projection':
      return generateRevenueProjection(fields);
    case 'cost-analysis':
      return generateCostAnalysis(fields);
    case 'roi-calculator':
      return generateROICalculation(fields);
    case 'market-analysis':
      return generateMarketAnalysis(fields);
    case 'budget-planner':
      return generateBudgetPlanner(fields);
    case 'performance-metrics':
      return generatePerformanceMetrics(fields);
    default:
      return { message: 'Tool type not recognized' };
  }
}

function generateRevenueProjection(fields: Record<string, any>) {
  const { currentRevenue, growthRate, timeframe, marketFactors } = fields;
  
  const months = parseInt(timeframe) || 12;
  const growth = parseFloat(growthRate) || 0;
  const current = parseFloat(currentRevenue) || 0;
  
  const projectedRevenue = current * Math.pow(1 + growth/100, months/12);
  const monthlyGrowth = (projectedRevenue - current) / months;
  
  return {
    currentRevenue: `$${current.toLocaleString()}`,
    projectedRevenue: `$${Math.round(projectedRevenue).toLocaleString()}`,
    monthlyGrowth: `$${Math.round(monthlyGrowth).toLocaleString()}`,
    totalGrowth: `$${Math.round(projectedRevenue - current).toLocaleString()}`,
    growthPercentage: `${Math.round(((projectedRevenue - current) / current) * 100)}%`,
    timeframe: `${months} months`,
    riskFactors: marketFactors || 'Standard market conditions',
    recommendation: projectedRevenue > current * 1.2 ? 'Strong growth expected' : 'Moderate growth projected',
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateCostAnalysis(fields: Record<string, any>) {
  const { fixedCosts, variableCosts, volume, category } = fields;
  
  const fixed = parseFloat(fixedCosts) || 0;
  const variable = parseFloat(variableCosts) || 0;
  const vol = parseFloat(volume) || 1;
  
  const totalVariableCosts = variable * vol;
  const totalCost = fixed + totalVariableCosts;
  const costPerUnit = totalCost / vol;
  
  return {
    fixedCosts: `$${fixed.toLocaleString()}`,
    variableCosts: `$${totalVariableCosts.toLocaleString()}`,
    totalCosts: `$${Math.round(totalCost).toLocaleString()}`,
    costPerUnit: `$${(Math.round(costPerUnit * 100) / 100).toFixed(2)}`,
    volume: vol.toLocaleString(),
    category: category || 'General',
    costBreakdown: {
      fixedPercentage: `${Math.round((fixed / totalCost) * 100)}%`,
      variablePercentage: `${Math.round((totalVariableCosts / totalCost) * 100)}%`
    },
    recommendation: fixed > totalVariableCosts ? 'Consider increasing volume to reduce per-unit costs' : 'Variable costs are dominant - focus on efficiency',
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateROICalculation(fields: Record<string, any>) {
  const { investment, returns, timeframe, riskLevel } = fields;
  
  const invest = parseFloat(investment) || 0;
  const ret = parseFloat(returns) || 0;
  const time = parseFloat(timeframe) || 1;
  
  const roi = ((ret - invest) / invest) * 100;
  const annualizedROI = roi / time;
  
  return {
    initialInvestment: `$${invest.toLocaleString()}`,
    expectedReturns: `$${ret.toLocaleString()}`,
    netProfit: `$${(ret - invest).toLocaleString()}`,
    roiPercentage: `${(Math.round(roi * 100) / 100).toFixed(2)}%`,
    annualizedROI: `${(Math.round(annualizedROI * 100) / 100).toFixed(2)}%`,
    timeframe: `${time} years`,
    riskLevel: riskLevel || 'Medium',
    paybackPeriod: `${(Math.round((invest / (ret / time)) * 100) / 100).toFixed(1)} years`,
    recommendation: roi > 15 ? 'Excellent ROI - Highly recommended' : roi > 10 ? 'Good ROI - Recommended' : 'Consider alternative investments',
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateMarketAnalysis(fields: Record<string, any>) {
  const { marketSize, targetSegment, competitors, growthRate } = fields;
  
  const size = parseFloat(marketSize) || 0;
  const growth = parseFloat(growthRate) || 0;
  const competitorCount = parseInt(competitors) || 1;
  
  return {
    totalMarketSize: `$${size.toLocaleString()}`,
    targetSegment: targetSegment || 'Primary',
    projectedGrowth: `${growth}% annually`,
    competitorAnalysis: {
      count: competitorCount,
      estimatedMarketShare: `${Math.round(100 / (competitorCount + 1))}%`,
      competitionLevel: competitorCount > 10 ? 'High' : competitorCount > 5 ? 'Medium' : 'Low'
    },
    marketOpportunities: [
      'Market expansion potential',
      'Product differentiation opportunities',
      'Customer acquisition strategies',
      'Partnership possibilities'
    ],
    threats: [
      'Increased competition risk',
      'Market saturation concerns',
      'Economic factor impacts',
      'Technology disruption'
    ],
    recommendation: competitorCount < 5 ? 'Favorable market conditions for entry' : 'Highly competitive - focus on differentiation',
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateBudgetPlanner(fields: Record<string, any>) {
  const { totalBudget, timeframe, priorities } = fields;
  
  const budget = parseFloat(totalBudget) || 0;
  const period = timeframe || 'Quarterly';
  
  const defaultAllocation = {
    marketing: 0.30,
    operations: 0.25,
    sales: 0.20,
    development: 0.15,
    administration: 0.10
  };
  
  return {
    totalBudget: `$${budget.toLocaleString()}`,
    timeframe: period,
    budgetAllocation: {
      marketing: `$${Math.round(budget * defaultAllocation.marketing).toLocaleString()}`,
      operations: `$${Math.round(budget * defaultAllocation.operations).toLocaleString()}`,
      sales: `$${Math.round(budget * defaultAllocation.sales).toLocaleString()}`,
      development: `$${Math.round(budget * defaultAllocation.development).toLocaleString()}`,
      administration: `$${Math.round(budget * defaultAllocation.administration).toLocaleString()}`
    },
    monthlyBudget: `$${Math.round(budget / (period === 'Annual' ? 12 : period === 'Quarterly' ? 3 : 1)).toLocaleString()}`,
    priorities: priorities || 'Revenue growth, Cost optimization, Market expansion',
    recommendation: 'Review allocation quarterly and adjust based on performance metrics',
    generatedAt: new Date().toLocaleDateString()
  };
}

function generatePerformanceMetrics(fields: Record<string, any>) {
  const { kpiType, currentValue, targetValue, timeframe } = fields;
  
  const current = parseFloat(currentValue) || 0;
  const target = parseFloat(targetValue) || 0;
  const period = timeframe || 'Monthly';
  
  const variance = target - current;
  const variancePercentage = current > 0 ? (variance / current) * 100 : 0;
  
  return {
    kpiType: kpiType || 'Revenue',
    currentPerformance: current.toLocaleString(),
    targetPerformance: target.toLocaleString(),
    variance: (Math.round(variance * 100) / 100).toLocaleString(),
    variancePercentage: `${(Math.round(variancePercentage * 100) / 100).toFixed(1)}%`,
    status: variance >= 0 ? 'On Track' : 'Below Target',
    timeframe: period,
    actionItems: variance < 0 ? [
      'Increase marketing efforts',
      'Optimize conversion processes',
      'Review pricing strategy',
      'Analyze competitor activities'
    ] : [
      'Maintain current strategy',
      'Explore growth opportunities',
      'Set higher targets',
      'Document best practices'
    ],
    recommendation: variance < 0 ? 'Immediate action required to close performance gap' : 'Performance on track - consider stretch goals',
    generatedAt: new Date().toLocaleDateString()
  };
}

async function generatePDF(toolType: string, fields: Record<string, any>, previewData: any) {
  // Simple PDF generation (in a real implementation, you'd use a proper PDF library)
  const content = `Business Operations Report: ${toolType.replace('-', ' ').toUpperCase()}
Generated: ${new Date().toLocaleDateString()}

INPUT PARAMETERS:
${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n')}

ANALYSIS RESULTS:
${Object.entries(previewData).map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`).join('\n')}
`;
  
  return new TextEncoder().encode(content);
}
