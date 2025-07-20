
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

    const { toolType, fields, userId, companyId } = await req.json() as ToolFormData;

    console.log('Processing business ops tool:', { toolType, userId, companyId });

    // Generate preview data based on tool type
    const previewData = await generatePreviewData(toolType, fields);

    // If PDF generation is requested
    if (req.url.includes('generate-pdf')) {
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
    currentRevenue: current,
    projectedRevenue: Math.round(projectedRevenue),
    monthlyGrowth: Math.round(monthlyGrowth),
    totalGrowth: Math.round(projectedRevenue - current),
    growthPercentage: Math.round(((projectedRevenue - current) / current) * 100),
    timeframe: months,
    riskFactors: marketFactors || 'Standard market conditions',
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateCostAnalysis(fields: Record<string, any>) {
  const { fixedCosts, variableCosts, volume, category } = fields;
  
  const fixed = parseFloat(fixedCosts) || 0;
  const variable = parseFloat(variableCosts) || 0;
  const vol = parseFloat(volume) || 1;
  
  const totalCost = fixed + (variable * vol);
  const costPerUnit = totalCost / vol;
  
  return {
    fixedCosts: fixed,
    variableCosts: variable * vol,
    totalCosts: Math.round(totalCost),
    costPerUnit: Math.round(costPerUnit * 100) / 100,
    volume: vol,
    category: category || 'General',
    breakdownPercentage: {
      fixed: Math.round((fixed / totalCost) * 100),
      variable: Math.round(((variable * vol) / totalCost) * 100)
    },
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
    initialInvestment: invest,
    expectedReturns: ret,
    netProfit: ret - invest,
    roiPercentage: Math.round(roi * 100) / 100,
    annualizedROI: Math.round(annualizedROI * 100) / 100,
    timeframe: time,
    riskLevel: riskLevel || 'Medium',
    paybackPeriod: Math.round((invest / (ret / time)) * 100) / 100,
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateMarketAnalysis(fields: Record<string, any>) {
  const { marketSize, targetSegment, competitors, growthRate } = fields;
  
  const size = parseFloat(marketSize) || 0;
  const growth = parseFloat(growthRate) || 0;
  const competitorCount = parseInt(competitors) || 1;
  
  return {
    totalMarketSize: size,
    targetSegment: targetSegment || 'Primary',
    projectedGrowth: growth,
    competitorAnalysis: {
      count: competitorCount,
      marketShare: Math.round(100 / (competitorCount + 1)),
      competitionLevel: competitorCount > 10 ? 'High' : competitorCount > 5 ? 'Medium' : 'Low'
    },
    opportunities: [
      'Market expansion potential',
      'Product differentiation',
      'Customer acquisition strategies'
    ],
    threats: [
      'Increased competition',
      'Market saturation risks',
      'Economic factors'
    ],
    generatedAt: new Date().toLocaleDateString()
  };
}

function generateBudgetPlanner(fields: Record<string, any>) {
  const { totalBudget, categories, timeframe, priorities } = fields;
  
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
    totalBudget: budget,
    timeframe: period,
    allocation: {
      marketing: Math.round(budget * defaultAllocation.marketing),
      operations: Math.round(budget * defaultAllocation.operations),
      sales: Math.round(budget * defaultAllocation.sales),
      development: Math.round(budget * defaultAllocation.development),
      administration: Math.round(budget * defaultAllocation.administration)
    },
    monthlyBudget: Math.round(budget / (period === 'Annual' ? 12 : period === 'Quarterly' ? 3 : 1)),
    priorities: priorities || ['Revenue growth', 'Cost optimization', 'Market expansion'],
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
    currentPerformance: current,
    targetPerformance: target,
    variance: Math.round(variance * 100) / 100,
    variancePercentage: Math.round(variancePercentage * 100) / 100,
    status: variance >= 0 ? 'On Track' : 'Below Target',
    timeframe: period,
    recommendations: variance < 0 ? [
      'Increase marketing efforts',
      'Optimize conversion rates',
      'Review pricing strategy'
    ] : [
      'Maintain current strategy',
      'Explore growth opportunities',
      'Set higher targets'
    ],
    generatedAt: new Date().toLocaleDateString()
  };
}

async function generatePDF(toolType: string, fields: Record<string, any>, previewData: any) {
  // Simple PDF generation (in a real implementation, you'd use a proper PDF library)
  const content = `
    Business Operations Report: ${toolType}
    Generated: ${new Date().toLocaleDateString()}
    
    Input Data:
    ${JSON.stringify(fields, null, 2)}
    
    Analysis Results:
    ${JSON.stringify(previewData, null, 2)}
  `;
  
  return new TextEncoder().encode(content);
}
