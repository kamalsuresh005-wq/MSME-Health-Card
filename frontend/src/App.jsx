// d:\Idbi\frontend\src\App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, Activity, TrendingUp, Coins, 
  AlertTriangle, CheckCircle2, Info, SlidersHorizontal, 
  Layers, FileCode, ArrowRight, Lock, RefreshCw, UserCheck, 
  Plus, Settings, Check, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Cell 
} from 'recharts';

import './App.css';

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return '';

  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1' ? 'http://localhost:8000' : '';
};

const getApiUrl = (path) => `${getApiBaseUrl()}${path}`;

// Client-side fallback scoring engine (identical math to python) to ensure front-end works even without backend server active
const CLIENT_MOCK_PROFILES = {
  "vardhman_garments": {
    "id": "vardhman_garments",
    "business_name": "Vardhman Garments",
    "constitution": "Proprietorship",
    "vintage_months": 72,
    "sector": "Retail & Textiles",
    "gst": {
      "registered": true,
      "annual_turnover_inr": 42000000,
      "yoy_growth_percent": 14.5,
      "filing_delays_3b_days": [2, 0, 0, 1, 0, 0, 3, 0, 0, 0, 1, 0],
      "tax_to_turnover_ratio": 0.052,
      "client_concentration_percent": 12.0
    },
    "upi": {
      "active": true,
      "avg_monthly_inflow_inr": 1200000,
      "avg_transaction_value_inr": 1500,
      "monthly_transaction_count": 850,
      "inflow_growth_percent": 12.0
    },
    "account_aggregator": {
      "linked": true,
      "avg_daily_balance_inr": 280000,
      "bank_statement_bounces": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "dscr": 2.1,
      "active_loans_count": 1,
      "monthly_emi_obligations_inr": 85000,
      "credit_card_utilization_percent": 34.0
    },
    "epfo": {
      "registered": true,
      "active_employees": 18,
      "headcount_trend_12m": [15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18],
      "contribution_delays_days": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  "apex_tech_solutions": {
    "id": "apex_tech_solutions",
    "business_name": "Apex Tech Solutions",
    "constitution": "Private Limited",
    "vintage_months": 36,
    "sector": "IT & Consulting",
    "gst": {
      "registered": true,
      "annual_turnover_inr": 85000000,
      "yoy_growth_percent": 42.0,
      "filing_delays_3b_days": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "tax_to_turnover_ratio": 0.18,
      "client_concentration_percent": 35.0
    },
    "upi": {
      "active": true,
      "avg_monthly_inflow_inr": 3500000,
      "avg_transaction_value_inr": 45000,
      "monthly_transaction_count": 90,
      "inflow_growth_percent": 38.0
    },
    "account_aggregator": {
      "linked": true,
      "avg_daily_balance_inr": 1200000,
      "bank_statement_bounces": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "dscr": 3.8,
      "active_loans_count": 0,
      "monthly_emi_obligations_inr": 0,
      "credit_card_utilization_percent": 15.0
    },
    "epfo": {
      "registered": true,
      "active_employees": 42,
      "headcount_trend_12m": [30, 31, 33, 35, 36, 38, 38, 40, 41, 41, 42, 42],
      "contribution_delays_days": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  },
  "krishna_kirana_store": {
    "id": "krishna_kirana_store",
    "business_name": "Krishna Kirana Store",
    "constitution": "Proprietorship",
    "vintage_months": 18,
    "sector": "Micro-Retail",
    "gst": {
      "registered": false,
      "annual_turnover_inr": 0,
      "yoy_growth_percent": 0.0,
      "filing_delays_3b_days": [],
      "tax_to_turnover_ratio": 0.0,
      "client_concentration_percent": 0.0
    },
    "upi": {
      "active": true,
      "avg_monthly_inflow_inr": 180000,
      "avg_transaction_value_inr": 250,
      "monthly_transaction_count": 720,
      "inflow_growth_percent": 5.0
    },
    "account_aggregator": {
      "linked": true,
      "avg_daily_balance_inr": 15000,
      "bank_statement_bounces": [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      "dscr": 1.2,
      "active_loans_count": 0,
      "monthly_emi_obligations_inr": 0,
      "credit_card_utilization_percent": 0.0
    },
    "epfo": {
      "registered": false,
      "active_employees": 0,
      "headcount_trend_12m": [],
      "contribution_delays_days": []
    }
  },
  "jai_hind_casting": {
    "id": "jai_hind_casting",
    "business_name": "Jai Hind Casting",
    "constitution": "Partnership",
    "vintage_months": 120,
    "sector": "Manufacturing",
    "gst": {
      "registered": true,
      "annual_turnover_inr": 124000000,
      "yoy_growth_percent": -4.2,
      "filing_delays_3b_days": [14, 18, 5, 22, 12, 10, 8, 15, 20, 25, 12, 9],
      "tax_to_turnover_ratio": 0.12,
      "client_concentration_percent": 55.0
    },
    "upi": {
      "active": false,
      "avg_monthly_inflow_inr": 0,
      "avg_transaction_value_inr": 0,
      "monthly_transaction_count": 0,
      "inflow_growth_percent": 0.0
    },
    "account_aggregator": {
      "linked": true,
      "avg_daily_balance_inr": 35000,
      "bank_statement_bounces": [2, 1, 3, 0, 1, 2, 0, 1, 4, 1, 2, 0],
      "dscr": 0.95,
      "active_loans_count": 3,
      "monthly_emi_obligations_inr": 450000,
      "credit_card_utilization_percent": 88.0
    },
    "epfo": {
      "registered": true,
      "active_employees": 55,
      "headcount_trend_12m": [60, 59, 58, 57, 56, 56, 55, 55, 55, 55, 55, 55],
      "contribution_delays_days": [5, 10, 12, 2, 4, 8, 0, 0, 14, 18, 5, 2]
    }
  }
};

const calculateClientAssessment = (profile, weights) => {
  const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalizedWeights = sumWeights > 0 
    ? Object.keys(weights).reduce((acc, k) => ({ ...acc, [k]: weights[k] / sumWeights }), {})
    : { liquidity: 0.2, stability: 0.2, growth: 0.2, compliance: 0.2, repayment: 0.2 };

  // 1. Liquidity
  let liqShap = [];
  let liqBase = 70;
  const dscr = profile.account_aggregator.linked ? profile.account_aggregator.dscr : 1.0;
  let dscrContrib = dscr >= 2.0 ? 18 : (dscr >= 1.5 ? 10 : (dscr >= 1.0 ? -5 : -20));
  liqShap.push({ feature: "Debt Service Coverage Ratio (DSCR)", value: dscrContrib });

  const adb = profile.account_aggregator.linked ? profile.account_aggregator.avg_daily_balance_inr : 0;
  const upiInflow = profile.upi.active ? profile.upi.avg_monthly_inflow_inr : 0;
  const gstTurnover = profile.gst.registered ? profile.gst.annual_turnover_inr : 0;
  const monthlySalesEst = Math.max(upiInflow, gstTurnover / 12.0, 10000);
  const adbRatio = adb / monthlySalesEst;
  let adbContrib = adbRatio >= 0.3 ? 12 : (adbRatio >= 0.15 ? 5 : (adbRatio >= 0.05 ? -2 : -15));
  liqShap.push({ feature: "Average Daily Balance Ratio", value: adbContrib });

  let upiContrib = profile.upi.active ? (upiInflow >= 1000000 ? 10 : (upiInflow >= 500000 ? 5 : 0)) : -5;
  liqShap.push({ feature: "UPI Cash Inflow Volume", value: upiContrib });
  let liqScore = Math.max(0, Math.min(100, liqBase + dscrContrib + adbContrib + upiContrib));

  // 2. Stability
  let stabShap = [];
  let stabBase = 65;
  const vintage = profile.vintage_months || 12;
  let vintageContrib = vintage >= 60 ? 20 : (vintage >= 36 ? 12 : (vintage >= 24 ? 5 : (vintage >= 12 ? -5 : -15)));
  stabShap.push({ feature: "Business Vintage (Months)", value: vintageContrib });

  let hcContrib = -5;
  if (profile.epfo.registered && profile.epfo.headcount_trend_12m.length > 0) {
    const trend = profile.epfo.headcount_trend_12m;
    const mean = trend.reduce((a,b)=>a+b,0) / trend.length;
    const sqDiff = trend.map(x => Math.pow(x-mean, 2));
    const std = Math.sqrt(sqDiff.reduce((a,b)=>a+b,0) / trend.length);
    const cv = mean > 0 ? std / mean : 0;
    const growth = trend[trend.length - 1] - trend[0];
    hcContrib = cv < 0.05 ? 10 : (cv < 0.15 ? 5 : -5);
    if (growth > 0) hcContrib += 5;
    else if (growth < 0) hcContrib -= 10;
  }
  stabShap.push({ feature: "EPFO Headcount Stability & Trend", value: hcContrib });

  const consti = profile.constitution || "Proprietorship";
  let constContrib = consti === "Private Limited" ? 10 : (consti === "Partnership" ? 5 : 0);
  stabShap.push({ feature: "Legal Constitution Type", value: constContrib });
  let stabScore = Math.max(0, Math.min(100, stabBase + vintageContrib + hcContrib + constContrib));

  // 3. Growth
  let growthShap = [];
  let growthBase = 60;
  let gstGrowthContrib = 0;
  if (profile.gst.registered) {
    const growth = profile.gst.yoy_growth_percent;
    gstGrowthContrib = growth >= 25.0 ? 25 : (growth >= 10.0 ? 15 : (growth >= 0.0 ? 5 : -15));
  }
  growthShap.push({ feature: "YoY GST Revenue Growth", value: gstGrowthContrib });

  let upiGrowthContrib = -5;
  if (profile.upi.active) {
    const upiGrowth = profile.upi.inflow_growth_percent;
    upiGrowthContrib = upiGrowth >= 25.0 ? 15 : (upiGrowth >= 10.0 ? 8 : (upiGrowth >= 0.0 ? 2 : -10));
  }
  growthShap.push({ feature: "UPI Inflow Growth Trend", value: upiGrowthContrib });

  const txCount = profile.upi.active ? profile.upi.monthly_transaction_count : 0;
  let txContrib = txCount >= 500 ? 10 : (txCount >= 100 ? 5 : -5);
  growthShap.push({ feature: "Transaction Velocity", value: txContrib });
  let growthScore = Math.max(0, Math.min(100, growthBase + gstGrowthContrib + upiGrowthContrib + txContrib));

  // 4. Compliance
  let compShap = [];
  let compBase = 75;
  let gstDelayContrib = 0;
  if (profile.gst.registered && profile.gst.filing_delays_3b_days.length > 0) {
    const delays = profile.gst.filing_delays_3b_days;
    const avg = delays.reduce((a,b)=>a+b,0) / delays.length;
    gstDelayContrib = avg === 0 ? 15 : (avg <= 3 ? 5 : (avg <= 10 ? -10 : -25));
  }
  compShap.push({ feature: "GST Filing Delay Consistency", value: gstDelayContrib });

  let epfoContrib = 0;
  if (profile.epfo.registered && profile.epfo.contribution_delays_days.length > 0) {
    const delays = profile.epfo.contribution_delays_days;
    const avg = delays.reduce((a,b)=>a+b,0) / delays.length;
    epfoContrib = avg === 0 ? 10 : (avg <= 5 ? 0 : -15);
  }
  compShap.push({ feature: "EPFO Deposit Compliance", value: epfoContrib });

  let taxContrib = -5;
  if (profile.gst.registered) {
    const ratio = profile.gst.tax_to_turnover_ratio;
    taxContrib = ratio >= 0.03 ? 5 : (ratio > 0 ? 0 : -10);
  }
  compShap.push({ feature: "Tax Compliance (Tax to Turnover)", value: taxContrib });
  let compScore = Math.max(0, Math.min(100, compBase + gstDelayContrib + epfoContrib + taxContrib));

  // 5. Repayment
  let repayShap = [];
  let repayBase = 80;
  let bounceContrib = -10;
  if (profile.account_aggregator.linked) {
    const totalBounces = profile.account_aggregator.bank_statement_bounces.reduce((a,b)=>a+b,0);
    bounceContrib = totalBounces === 0 ? 15 : (totalBounces <= 2 ? -10 : (totalBounces <= 5 ? -25 : -45));
  }
  repayShap.push({ feature: "Bank Statement Inward Bounces", value: bounceContrib });

  let utilContrib = 0;
  if (profile.account_aggregator.linked) {
    const util = profile.account_aggregator.credit_card_utilization_percent;
    utilContrib = util <= 30.0 ? 5 : (util <= 50.0 ? 0 : (util <= 80.0 ? -15 : -30));
  }
  repayShap.push({ feature: "Overdraft/Credit Card Utilization", value: utilContrib });

  let loanContrib = -5;
  if (profile.account_aggregator.linked) {
    const active = profile.account_aggregator.active_loans_count;
    loanContrib = active === 0 ? 5 : (active <= 2 && dscr >= 1.5 ? 0 : -10);
  }
  repayShap.push({ feature: "Existing Debt Burden", value: loanContrib });
  let repayScore = Math.max(0, Math.min(100, repayBase + bounceContrib + utilContrib + loanContrib));

  // Confidence
  const confidenceScore = (profile.gst.registered ? 30 : 0) +
                          (profile.epfo.registered ? 20 : 0) +
                          (profile.account_aggregator.linked ? 30 : 0) +
                          (profile.upi.active ? 20 : 0);

  const weightedSubscore = (
    liqScore * normalizedWeights.liquidity +
    stabScore * normalizedWeights.stability +
    growthScore * normalizedWeights.growth +
    compScore * normalizedWeights.compliance +
    repayScore * normalizedWeights.repayment
  );

  const overallScore = Math.round(300 + (weightedSubscore / 100.0) * 600);

  const riskFlags = [];
  const strengthFlags = [];

  if (profile.account_aggregator.linked) {
    const bounces = profile.account_aggregator.bank_statement_bounces.reduce((a,b)=>a+b,0);
    if (bounces > 3) {
      riskFlags.push({ severity: "HIGH", source: "Account Aggregator", message: `Frequent bank statement bounces (${bounces} times in 12 months) indicates liquidity strain.` });
    } else if (bounces > 0) {
      riskFlags.push({ severity: "MEDIUM", source: "Account Aggregator", message: "Minor bank account bounces detected." });
    } else {
      strengthFlags.push({ source: "Account Aggregator", message: "Clean repayment track record with zero debit bounces." });
    }
    if (dscr < 1.0) {
      riskFlags.push({ severity: "HIGH", source: "Account Aggregator", message: `Debt Service Coverage Ratio (DSCR: ${dscr}) is below unit threshold.` });
    } else if (dscr >= 2.0) {
      strengthFlags.push({ source: "Account Aggregator", message: `Strong debt service coverage (DSCR: ${dscr}x).` });
    }
  }

  if (profile.gst.registered) {
    const growth = profile.gst.yoy_growth_percent;
    if (growth > 20) {
      strengthFlags.push({ source: "GSTN", message: `Outstanding Year-on-Year growth of ${growth}%.` });
    } else if (growth < 0) {
      riskFlags.push({ severity: "MEDIUM", source: "GSTN", message: `Contracting year-on-year business turnover (${growth}%).` });
    }
    const delays = profile.gst.filing_delays_3b_days;
    if (delays.length > 0) {
      const avg = delays.reduce((a,b)=>a+b,0) / delays.length;
      if (avg > 10) {
        riskFlags.push({ severity: "HIGH", source: "GSTN", message: `Consistent GST filing delays (Average: ${Math.round(avg)} days delay).` });
      } else if (avg === 0) {
        strengthFlags.push({ source: "GSTN", message: "Punctual tax filings with zero GSTR-3B delays." });
      }
    }
  }

  if (profile.epfo.registered) {
    const employees = profile.epfo.active_employees;
    if (employees > 20) {
      strengthFlags.push({ source: "EPFO", message: `Healthy corporate scale with ${employees} active employees.` });
    }
    const trend = profile.epfo.headcount_trend_12m;
    if (trend.length > 1 && trend[trend.length - 1] < trend[0] * 0.8) {
      riskFlags.push({ severity: "HIGH", source: "EPFO", message: "Significant employee count contraction (>20% reduction) in past 12 months." });
    }
  }

  if (confidenceScore < 70) {
    riskFlags.push({ severity: "MEDIUM", source: "System Gate", message: `Thin-file profile (Confidence: ${confidenceScore}%). Scored provisionally due to missing GST or EPFO records.` });
  }

  return {
    uli_payload_header: {
      version: "1.0",
      message_id: "msg_client_simulated_" + Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      consent_ref: "cns_client_direct"
    },
    assessment: {
      business_name: profile.business_name,
      constitution: profile.constitution,
      sector: profile.sector,
      vintage_months: profile.vintage_months,
      overall_score: overallScore,
      is_provisional: confidenceScore < 70,
      confidence_score: confidenceScore,
      weights: normalizedWeights,
      sub_scores: {
        liquidity: parseFloat(liqScore.toFixed(1)),
        stability: parseFloat(stabScore.toFixed(1)),
        growth: parseFloat(growthScore.toFixed(1)),
        compliance: parseFloat(compScore.toFixed(1)),
        repayment: parseFloat(repayScore.toFixed(1))
      },
      shap_values: {
        liquidity: liqShap,
        stability: stabShap,
        growth: growthShap,
        compliance: compShap,
        repayment: repayShap
      },
      risk_flags: riskFlags,
      strength_flags: strengthFlags
    }
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState('consent'); // 'consent' | 'lender' | 'sandbox' | 'api'
  const [profilesList, setProfilesList] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('vardhman_garments');
  const [currentProfileData, setCurrentProfileData] = useState(CLIENT_MOCK_PROFILES['vardhman_garments']);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [selectedShapDimension, setSelectedShapDimension] = useState('liquidity');
  
  // Weights State
  const [weights, setWeights] = useState({
    liquidity: 0.20,
    stability: 0.20,
    growth: 0.20,
    compliance: 0.20,
    repayment: 0.20
  });

  // Weights Presets
  const presets = {
    standard: { label: "Standard Term Loan Weighting", weights: { liquidity: 0.20, stability: 0.25, growth: 0.15, compliance: 0.20, repayment: 0.20 } },
    working_capital: { label: "Working Capital (High Liquidity/Growth)", weights: { liquidity: 0.35, stability: 0.10, growth: 0.25, compliance: 0.10, repayment: 0.20 } },
    micro_retail: { label: "Micro-Retail (UPI/Compliance Focus)", weights: { liquidity: 0.20, stability: 0.10, growth: 0.15, compliance: 0.35, repayment: 0.20 } }
  };

  // Consent Form State
  const [consentStage, setConsentStage] = useState(1); // 1: Info Form, 2: Select Sources, 3: Fetching Simulation, 4: Complete
  const [consentForm, setConsentForm] = useState({
    businessName: '',
    constitution: 'Proprietorship',
    vintage: '24',
    sector: 'Retail',
    gstin: '',
    pan: '',
    epfoId: '',
    mobile: ''
  });
  
  const [grantedSources, setGrantedSources] = useState({
    gst: true,
    upi: true,
    aa: true,
    epfo: false
  });

  const [simSteps, setSimSteps] = useState([
    { id: 'auth', label: 'Verifying PAN & GSTIN Authenticity', status: 'pending' },
    { id: 'aa', label: 'Connecting Account Aggregator API Gateway', status: 'pending' },
    { id: 'upi', label: 'Analyzing 365 Days UPI Merchant Inflows', status: 'pending' },
    { id: 'epfo', label: 'Reconciling EPFO Payroll Contributions', status: 'pending' },
    { id: 'score', label: 'Running Multidimensional scoring ML models', status: 'pending' }
  ]);

  // Loading API Status
  const [apiStatus, setApiStatus] = useState('idle');

  // Trigger Assessment
  const runAssessment = () => {
    // Prefer a live backend when available, but fall back to client-side scoring so the app works on Vercel.
    setApiStatus('loading');
    fetch(getApiUrl('/api/score'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_id: selectedProfileId,
        weights: weights
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("API call unsuccessful");
      return res.json();
    })
    .then(data => {
      setAssessmentResult(data);
      setApiStatus('success');
    })
    .catch(() => {
      console.warn("Backend connection not available. Performing calculations on the client side.");
      const data = calculateClientAssessment(currentProfileData, weights);
      setAssessmentResult(data);
      setApiStatus('success-local');
    });
  };

  // Handle weight adjustments
  const handleWeightChange = (dimension, val) => {
    const numVal = parseFloat(val);
    setWeights(prev => ({
      ...prev,
      [dimension]: numVal
    }));
  };

  // Handle Preset Selections
  const applyPreset = (presetKey) => {
    if (presets[presetKey]) {
      setWeights(presets[presetKey].weights);
    }
  };

  // Refresh profile list or update selection
  useEffect(() => {
    fetch(getApiUrl('/api/profiles'))
      .then(res => {
        if (!res.ok) throw new Error('Profiles API unavailable');
        return res.json();
      })
      .then(data => setProfilesList(data))
      .catch(() => {
        // Fallback profile list for Vercel/static deployments
        setProfilesList(Object.keys(CLIENT_MOCK_PROFILES).map(k => ({
          id: k,
          business_name: CLIENT_MOCK_PROFILES[k].business_name,
          constitution: CLIENT_MOCK_PROFILES[k].constitution,
          sector: CLIENT_MOCK_PROFILES[k].sector,
          has_gst: CLIENT_MOCK_PROFILES[k].gst.registered,
          has_upi: CLIENT_MOCK_PROFILES[k].upi.active,
          has_aa: CLIENT_MOCK_PROFILES[k].account_aggregator.linked,
          has_epfo: CLIENT_MOCK_PROFILES[k].epfo.registered
        })));
      });
  }, []);

  // Recalculate whenever profile, weights or data changes
  useEffect(() => {
    runAssessment();
  }, [selectedProfileId, weights, currentProfileData]);

  // Handle custom profiles selection
  const selectProfile = (id) => {
    setSelectedProfileId(id);
    setCurrentProfileData(CLIENT_MOCK_PROFILES[id] || CLIENT_MOCK_PROFILES['vardhman_garments']);
  };

  // Execute consent simulation steps
  const startConsentSimulation = (e) => {
    e.preventDefault();
    setConsentStage(3);
    
    // Simulate steps in sequence
    let stepIndex = 0;
    const interval = setInterval(() => {
      setSimSteps(prev => prev.map((step, idx) => {
        if (idx === stepIndex) {
          return { ...step, status: 'fetching' };
        } else if (idx < stepIndex) {
          return { ...step, status: 'done' };
        }
        return step;
      }));

      setTimeout(() => {
        setSimSteps(prev => prev.map((step, idx) => {
          if (idx === stepIndex) {
            return { ...step, status: 'done' };
          }
          return step;
        }));
        stepIndex++;
        if (stepIndex === simSteps.length) {
          clearInterval(interval);
          setTimeout(() => {
            // Generate customized profile based on consent form inputs
            const newProfileId = "custom_" + Date.now();
            const customizedProfile = {
              id: newProfileId,
              business_name: consentForm.businessName || "New Merchant Store",
              constitution: consentForm.constitution,
              vintage_months: parseInt(consentForm.vintage) || 24,
              sector: consentForm.sector,
              gst: {
                registered: grantedSources.gst,
                annual_turnover_inr: grantedSources.gst ? 32000000 : 0,
                yoy_growth_percent: grantedSources.gst ? 15.0 : 0,
                filing_delays_3b_days: grantedSources.gst ? [0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0] : [],
                tax_to_turnover_ratio: grantedSources.gst ? 0.06 : 0.0,
                client_concentration_percent: grantedSources.gst ? 20.0 : 0.0
              },
              upi: {
                active: grantedSources.upi,
                avg_monthly_inflow_inr: grantedSources.upi ? 600000 : 0,
                avg_transaction_value_inr: grantedSources.upi ? 800 : 0,
                monthly_transaction_count: grantedSources.upi ? 450 : 0,
                inflow_growth_percent: grantedSources.upi ? 10.0 : 0.0
              },
              account_aggregator: {
                linked: grantedSources.aa,
                avg_daily_balance_inr: grantedSources.aa ? 120000 : 0,
                bank_statement_bounces: grantedSources.aa ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : [],
                dscr: grantedSources.aa ? 1.85 : 1.0,
                active_loans_count: 0,
                monthly_emi_obligations_inr: 0,
                credit_card_utilization_percent: grantedSources.aa ? 25.0 : 0.0
              },
              epfo: {
                registered: grantedSources.epfo,
                active_employees: grantedSources.epfo ? 12 : 0,
                headcount_trend_12m: grantedSources.epfo ? [10, 10, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12] : [],
                contribution_delays_days: grantedSources.epfo ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : []
              }
            };
            
            // Add to Mock dataset
            CLIENT_MOCK_PROFILES[newProfileId] = customizedProfile;
            setCurrentProfileData(customizedProfile);
            setSelectedProfileId(newProfileId);
            setProfilesList(prev => [
              ...prev,
              {
                id: newProfileId,
                business_name: customizedProfile.business_name,
                constitution: customizedProfile.constitution,
                sector: customizedProfile.sector,
                has_gst: customizedProfile.gst.registered,
                has_upi: customizedProfile.upi.active,
                has_aa: customizedProfile.account_aggregator.linked,
                has_epfo: customizedProfile.epfo.registered
              }
            ]);
            
            setConsentStage(4);
          }, 800);
        }
      }, 600);
    }, 1200);
  };

  const getScoreRatingClass = (score) => {
    if (score >= 800) return 'rating-excellent';
    if (score >= 700) return 'rating-good';
    if (score >= 600) return 'rating-fair';
    return 'rating-poor';
  };

  const getScoreRatingLabel = (score) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor / Stressed';
  };

  // Convert SHAP data format for chart
  const getShapChartData = () => {
    if (!assessmentResult) return [];
    const dimension = selectedShapDimension;
    const values = assessmentResult.assessment.shap_values[dimension] || [];
    return values.map(item => ({
      name: item.feature,
      Impact: item.value
    }));
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">💡</div>
          <div>
            <div className="brand-title">MSME Financial Health Card</div>
            <div className="brand-badge">IDBI Innovate AI/ML Engine</div>
          </div>
        </div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'consent' ? 'active' : ''}`}
            onClick={() => setActiveTab('consent')}
          >
            <UserCheck size={16} />
            MSME Consent Flow
          </button>
          <button 
            className={`nav-tab ${activeTab === 'lender' ? 'active' : ''}`}
            onClick={() => setActiveTab('lender')}
          >
            <SlidersHorizontal size={16} />
            Lender Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Settings size={16} />
            Profile Sandbox
          </button>
          <button 
            className={`nav-tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <FileCode size={16} />
            ULI/OCEN APIs
          </button>
        </nav>
      </header>

      {/* Main Workspace content */}
      <main className="app-content">
        
        {/* Tab 1: Consent Flow */}
        {activeTab === 'consent' && (
          <div className="card consent-container">
            <div className="section-header">
              <div>
                <h2 className="section-title"><Lock size={20} className="info-banner-icon" /> Consent-Based Data Aggregation</h2>
                <p className="section-subtitle">Frictionless digital onboarding using India's Account Aggregator & open public APIs</p>
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="consent-stages">
              <div className={`stage-node ${consentStage >= 1 ? 'active' : ''} ${consentStage > 1 ? 'completed' : ''}`}>
                <div className="node-dot">{consentStage > 1 ? <Check size={14} /> : "1"}</div>
                <div className="node-label">Registration</div>
              </div>
              <div className={`stage-node ${consentStage >= 2 ? 'active' : ''} ${consentStage > 2 ? 'completed' : ''}`}>
                <div className="node-dot">{consentStage > 2 ? <Check size={14} /> : "2"}</div>
                <div className="node-label">Consent Request</div>
              </div>
              <div className={`stage-node ${consentStage >= 3 ? 'active' : ''} ${consentStage > 3 ? 'completed' : ''}`}>
                <div className="node-dot">{consentStage > 3 ? <Check size={14} /> : "3"}</div>
                <div className="node-label">Aggregation</div>
              </div>
              <div className={`stage-node ${consentStage >= 4 ? 'active' : ''} ${consentStage > 4 ? 'completed' : ''}`}>
                <div className="node-dot">{consentStage > 4 ? <Check size={14} /> : "4"}</div>
                <div className="node-label">Verified</div>
              </div>
            </div>

            {/* Stage 1: Basic Information */}
            {consentStage === 1 && (
              <form onSubmit={() => setConsentStage(2)}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Business / Shop Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Balaji Groceries" 
                      value={consentForm.businessName}
                      onChange={e => setConsentForm({...consentForm, businessName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Legal Constitution</label>
                    <select 
                      className="form-select"
                      value={consentForm.constitution}
                      onChange={e => setConsentForm({...consentForm, constitution: e.target.value})}
                    >
                      <option>Proprietorship</option>
                      <option>Partnership</option>
                      <option>Private Limited</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Business Vintage (Months)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 36"
                      value={consentForm.vintage}
                      onChange={e => setConsentForm({...consentForm, vintage: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry Sector</label>
                    <select 
                      className="form-select"
                      value={consentForm.sector}
                      onChange={e => setConsentForm({...consentForm, sector: e.target.value})}
                    >
                      <option>Retail</option>
                      <option>Manufacturing</option>
                      <option>IT Services</option>
                      <option>Wholesale Trade</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">GSTIN (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="27AAAAA1111A1Z1" 
                      value={consentForm.gstin}
                      onChange={e => setConsentForm({...consentForm, gstin: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registered Mobile (Linked to AA)</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="9876543210" 
                      value={consentForm.mobile}
                      onChange={e => setConsentForm({...consentForm, mobile: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="btn-group">
                  <div></div>
                  <button type="submit" className="btn">
                    Continue to Consent <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Stage 2: Select Alternate Data Sources */}
            {consentStage === 2 && (
              <div>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  Please authorize access to the following alternate databases to build your digital Financial Health Card. This consent is time-bound (valid for 30 days) and purpose-specific (credit assessment only).
                </p>

                <div className="consent-options">
                  <div 
                    className={`consent-option-card ${grantedSources.gst ? 'selected' : ''}`}
                    onClick={() => setGrantedSources({...grantedSources, gst: !grantedSources.gst})}
                  >
                    <input 
                      type="checkbox" 
                      className="consent-checkbox" 
                      checked={grantedSources.gst} 
                      readOnly
                    />
                    <div className="option-details">
                      <div className="option-title">GSTN API Portal (Indirect Tax)</div>
                      <div className="option-desc">Verifies monthly turnover (GSTR-3B), invoice authenticity, and compliance records.</div>
                    </div>
                  </div>

                  <div 
                    className={`consent-option-card ${grantedSources.upi ? 'selected' : ''}`}
                    onClick={() => setGrantedSources({...grantedSources, upi: !grantedSources.upi})}
                  >
                    <input 
                      type="checkbox" 
                      className="consent-checkbox" 
                      checked={grantedSources.upi} 
                      readOnly
                    />
                    <div className="option-details">
                      <div className="option-title">UPI QR/Merchant Transaction Inflow logs</div>
                      <div className="option-desc">Aggregates real-time daily cash inflows, customer frequency, and revenue momentum.</div>
                    </div>
                  </div>

                  <div 
                    className={`consent-option-card ${grantedSources.aa ? 'selected' : ''}`}
                    onClick={() => setGrantedSources({...grantedSources, aa: !grantedSources.aa})}
                  >
                    <input 
                      type="checkbox" 
                      className="consent-checkbox" 
                      checked={grantedSources.aa} 
                      readOnly
                    />
                    <div className="option-details">
                      <div className="option-title">Account Aggregator (Consent-based Bank Statement)</div>
                      <div className="option-desc">Connects your primary current accounts safely to verify daily average balance, cashflows, and debt commitments.</div>
                    </div>
                  </div>

                  <div 
                    className={`consent-option-card ${grantedSources.epfo ? 'selected' : ''}`}
                    onClick={() => setGrantedSources({...grantedSources, epfo: !grantedSources.epfo})}
                  >
                    <input 
                      type="checkbox" 
                      className="consent-checkbox" 
                      checked={grantedSources.epfo} 
                      readOnly
                    />
                    <div className="option-details">
                      <div className="option-title">EPFO Employee Headcount Portal</div>
                      <div className="option-desc">Verifies active employee count trend and employer monthly payroll compliance.</div>
                    </div>
                  </div>
                </div>

                <div className="btn-group">
                  <button type="button" className="btn btn-secondary" onClick={() => setConsentStage(1)}>
                    Back
                  </button>
                  <button type="button" className="btn" onClick={startConsentSimulation}>
                    Authorize & Request Fetch <ShieldCheck size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 3: Linking Simulation */}
            {consentStage === 3 && (
              <div className="linking-simulation-container">
                <div className="spinner-outer">
                  <div className="spinner-circle"></div>
                  <div className="spinner-circle"></div>
                  <div className="spinner-circle"></div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Aggregating Consent-based Alternate Data</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Connecting to public APIs and financial information providers...</p>
                </div>
                <div className="flow-step-checks">
                  {simSteps.map(step => (
                    <div className="check-line" key={step.id}>
                      <div className="check-label">
                        {step.status === 'done' ? <CheckCircle2 size={16} color="var(--color-success)" /> : 
                         step.status === 'fetching' ? <RefreshCw size={16} className="info-banner-icon animate-spin" /> : 
                         <HelpCircle size={16} color="var(--color-text-muted)" />}
                        <span>{step.label}</span>
                      </div>
                      <span className={`check-status-text status-${step.status}`}>
                        {step.status === 'done' ? 'Success' : step.status === 'fetching' ? 'Connecting...' : 'Queued'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 4: Completed */}
            {consentStage === 4 && (
              <div className="linking-simulation-container">
                <CheckCircle2 size={64} color="var(--color-success)" />
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#fff' }}>Data Aggregated Successfully!</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                    Financial health scoring models and SHAP explanations are ready. We have created a dynamic profile matching your input.
                  </p>
                </div>
                <div className="btn-group" style={{ width: '100%', justifyContent: 'center' }}>
                  <button 
                    className="btn" 
                    onClick={() => {
                      setActiveTab('lender');
                      setConsentStage(1);
                      setConsentForm({
                        businessName: '',
                        constitution: 'Proprietorship',
                        vintage: '24',
                        sector: 'Retail',
                        gstin: '',
                        pan: '',
                        epfoId: '',
                        mobile: ''
                      });
                    }}
                  >
                    View Financial Health Card <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Lender Workspace */}
        {activeTab === 'lender' && (
          <div>
            {/* Top Selector Bar */}
            <div className="profile-bar">
              <div className="profile-selector">
                <Building2 size={20} className="info-banner-icon" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Evaluation Target:</span>
                <select 
                  className="profile-select"
                  value={selectedProfileId}
                  onChange={e => selectProfile(e.target.value)}
                >
                  {profilesList.map(p => (
                    <option key={p.id} value={p.id}>{p.business_name}</option>
                  ))}
                </select>
              </div>

              {assessmentResult && (
                <div className="profile-metadata">
                  <div className="meta-item">
                    <span className="meta-label">Constitution</span>
                    <span className="meta-value">{assessmentResult.assessment.constitution}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Sector</span>
                    <span className="meta-value">{assessmentResult.assessment.sector}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Vintage</span>
                    <span className="meta-value">{assessmentResult.assessment.vintage_months} Months</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Connection Status</span>
                    <span className="meta-value" style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldCheck size={14} /> Encrypted
                    </span>
                  </div>
                </div>
              )}
            </div>

            {assessmentResult ? (
              <div className="lender-panel-layout">
                {/* Left Panel: Weight Tuning + Overall score */}
                <div className="flex-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Credit Score Gauge Card */}
                  <div className="card">
                    <h3 className="editor-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Activity size={18} /> Financial Health Card Score
                    </h3>
                    <div className="score-circle-container">
                      <div className="score-circle">
                        <svg className="score-svg">
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="50%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                          </defs>
                          <circle className="score-circle-bg" cx="100" cy="100" r="85" />
                          <circle 
                            className="score-circle-fill" 
                            cx="100" 
                            cy="100" 
                            r="85" 
                            strokeDasharray={2 * Math.PI * 85}
                            // Scale overall_score (300 to 900) onto a percentage [0 to 100]
                            strokeDashoffset={
                              2 * Math.PI * 85 - (2 * Math.PI * 85 * ((assessmentResult.assessment.overall_score - 300) / 600))
                            }
                          />
                        </svg>
                        <div className="score-center-text">
                          <span className="score-num">{assessmentResult.assessment.overall_score}</span>
                          <span className="score-max">OUT OF 900</span>
                        </div>
                      </div>

                      <span className={`score-rating ${getScoreRatingClass(assessmentResult.assessment.overall_score)}`}>
                        {getScoreRatingLabel(assessmentResult.assessment.overall_score)}
                      </span>

                      {assessmentResult.assessment.is_provisional && (
                        <div className="provisional-badge">
                          <AlertTriangle size={16} />
                          <span>Provisional Score (Thin File)</span>
                        </div>
                      )}

                      <div className="confidence-indicator">
                        <div className="confidence-header">
                          <span>Data Sufficiency Confidence</span>
                          <span style={{ fontWeight: 700 }}>{assessmentResult.assessment.confidence_score}%</span>
                        </div>
                        <div className="confidence-bar-bg">
                          <div 
                            className="confidence-bar-fill"
                            style={{ width: `${assessmentResult.assessment.confidence_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lender Weight Settings */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <h3 className="editor-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                        <SlidersHorizontal size={18} /> Score Weight Tuning
                      </h3>
                      <button 
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => setWeights({ liquidity: 0.2, stability: 0.2, growth: 0.2, compliance: 0.2, repayment: 0.2 })}
                      >
                        Reset Equal
                      </button>
                    </div>

                    {/* Presets dropdown */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Lender Product Presets</label>
                      <select 
                        className="form-select" 
                        style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                        onChange={e => applyPreset(e.target.value)}
                        defaultValue="equal"
                      >
                        <option value="equal">Equal Weightings (20% Each)</option>
                        <option value="standard">Term Loan (Vintage & Repayment Focus)</option>
                        <option value="working_capital">Working Capital Line (Growth & Cashflow Focus)</option>
                        <option value="micro_retail">Micro-lending (Compliance & UPI Focus)</option>
                      </select>
                    </div>

                    <div className="weight-sliders">
                      {Object.keys(weights).map(k => (
                        <div className="slider-group" key={k}>
                          <div className="slider-header">
                            <span className="subscore-name">{k}</span>
                            <span className="slider-val">{Math.round(weights[k] * 100)}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            className="range-input"
                            value={weights[k]}
                            onChange={e => handleWeightChange(k, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Panel: Sub-score list, explainable SHAP bars, flags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Detailed Scores & Explanation selector */}
                  <div className="card">
                    <h3 className="editor-card-title">
                      <Layers size={18} /> Credit Dimension Sub-Scores
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                      Select a sub-dimension row to explore Explainable AI (SHAP) contribution details below.
                    </p>

                    <div className="subscores-container">
                      {Object.keys(assessmentResult.assessment.sub_scores).map(dim => {
                        const score = assessmentResult.assessment.sub_scores[dim];
                        const isSelected = selectedShapDimension === dim;
                        return (
                          <div 
                            key={dim}
                            className={`subscore-row`}
                            style={{ 
                              cursor: 'pointer', 
                              padding: '0.5rem', 
                              borderRadius: '0.5rem', 
                              background: isSelected ? 'rgba(79,70,229,0.08)' : 'transparent',
                              border: isSelected ? '1px solid rgba(79,70,229,0.3)' : '1px solid transparent',
                              transition: 'var(--transition-smooth)'
                            }}
                            onClick={() => setSelectedShapDimension(dim)}
                          >
                            <span className="subscore-name" style={{ color: isSelected ? '#fff' : 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              {dim === 'liquidity' && <Coins size={14} color="#3b82f6" />}
                              {dim === 'stability' && <ShieldCheck size={14} color="#8b5cf6" />}
                              {dim === 'growth' && <TrendingUp size={14} color="#ec4899" />}
                              {dim === 'compliance' && <CheckCircle2 size={14} color="#f59e0b" />}
                              {dim === 'repayment' && <Activity size={14} color="#10b981" />}
                              {dim}
                            </span>
                            <div className="subscore-progress-container">
                              <div 
                                className={`subscore-progress-bar bar-${dim}`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span className="subscore-val" style={{ color: isSelected ? '#fff' : 'var(--color-text-primary)' }}>
                              {score}/100
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SHAP Feature Contribution Chart */}
                  <div className="card shap-panel-container">
                    <h3 className="editor-card-title" style={{ textTransform: 'capitalize', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>📊 Explainable AI Analysis: {selectedShapDimension}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'none' }}>SHAP Attribution Values (Deviation from base)</span>
                    </h3>

                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={getShapChartData()}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" domain={[-50, 50]} stroke="var(--color-text-muted)" style={{ fontSize: '0.75rem' }} />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          stroke="var(--color-text-muted)" 
                          width={140}
                          style={{ fontSize: '0.7rem', fontWeight: 500 }}
                        />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: '#121829', 
                            borderColor: 'var(--border-color)', 
                            color: 'var(--color-text-primary)',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem'
                          }}
                        />
                        <ReferenceLine x={0} stroke="rgba(255,255,255,0.3)" />
                        <Bar dataKey="Impact">
                          {getShapChartData().map((entry, index) => {
                            const isPositive = entry.Impact >= 0;
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={isPositive ? 'var(--color-success)' : 'var(--color-danger)'} 
                                fillOpacity={0.8}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Strengths & Weaknesses Panel */}
                  <div className="dashboard-grid">
                    {/* Strengths */}
                    <div className="card">
                      <h4 className="editor-card-title" style={{ borderBottomColor: 'rgba(16,185,129,0.1)' }}>
                        🟢 Credit Strengths
                      </h4>
                      <div className="flags-list">
                        {assessmentResult.assessment.strength_flags.length > 0 ? (
                          assessmentResult.assessment.strength_flags.map((flag, idx) => (
                            <div className="flag-item strength" key={idx}>
                              <CheckCircle2 size={16} className="flag-icon" />
                              <div className="flag-content">
                                <span className="flag-source">{flag.source}</span>
                                <span>{flag.message}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state">No major outstanding strengths flagged.</div>
                        )}
                      </div>
                    </div>

                    {/* Risks & Warnings */}
                    <div className="card">
                      <h4 className="editor-card-title" style={{ borderBottomColor: 'rgba(239,68,68,0.1)' }}>
                        🔴 Risk & Alert Flags
                      </h4>
                      <div className="flags-list">
                        {assessmentResult.assessment.risk_flags.length > 0 ? (
                          assessmentResult.assessment.risk_flags.map((flag, idx) => (
                            <div 
                              className={`flag-item ${flag.severity === 'HIGH' ? 'risk-high' : 'risk-medium'}`} 
                              key={idx}
                            >
                              <AlertTriangle size={16} className="flag-icon" />
                              <div className="flag-content">
                                <span className="flag-source">{flag.source} ({flag.severity})</span>
                                <span>{flag.message}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state" style={{ color: 'var(--color-success)' }}>
                            🎉 Clean record. No Risk alerts generated.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="empty-state">Evaluating credit assessment...</div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="card">
            <div className="section-header">
              <div>
                <h2 className="section-title"><Settings size={20} className="info-banner-icon" /> Dynamic Parameter Sandbox</h2>
                <p className="section-subtitle">Tweak the alternative data parameters manually to simulate real-time model re-calculations.</p>
              </div>
            </div>

            <div className="editor-grid">
              {/* Data Form Editor */}
              <div className="editor-card">
                <h4 className="editor-card-title">Merchant Details</h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={currentProfileData.business_name}
                      onChange={e => setCurrentProfileData({...currentProfileData, business_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vintage Months</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={currentProfileData.vintage_months}
                      onChange={e => setCurrentProfileData({...currentProfileData, vintage_months: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <h4 className="editor-card-title" style={{ marginTop: '1.5rem' }}>Account Aggregator (Bank Statements)</h4>
                <div className="consent-option-card" style={{ marginBottom: '1rem' }} onClick={() => {
                  const linked = !currentProfileData.account_aggregator.linked;
                  setCurrentProfileData({
                    ...currentProfileData,
                    account_aggregator: { ...currentProfileData.account_aggregator, linked }
                  });
                }}>
                  <input type="checkbox" checked={currentProfileData.account_aggregator.linked} className="consent-checkbox" readOnly />
                  <div className="option-details">
                    <span className="option-title">Link Account Aggregator</span>
                    <span className="option-desc">Connects verified current account details.</span>
                  </div>
                </div>

                {currentProfileData.account_aggregator.linked && (
                  <>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Debt Service Coverage (DSCR)</label>
                        <input 
                          type="number" 
                          step="0.05"
                          className="form-input" 
                          value={currentProfileData.account_aggregator.dscr}
                          onChange={e => setCurrentProfileData({
                            ...currentProfileData,
                            account_aggregator: { ...currentProfileData.account_aggregator, dscr: parseFloat(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Avg Daily Balance (INR)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={currentProfileData.account_aggregator.avg_daily_balance_inr}
                          onChange={e => setCurrentProfileData({
                            ...currentProfileData,
                            account_aggregator: { ...currentProfileData.account_aggregator, avg_daily_balance_inr: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Total Debit Bounces (12 Months)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={currentProfileData.account_aggregator.bank_statement_bounces.reduce((a,b)=>a+b,0)}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            // Re-simulate array
                            const arr = Array(12).fill(0);
                            arr[0] = val; // Put them all in index 0 for simplicity
                            setCurrentProfileData({
                              ...currentProfileData,
                              account_aggregator: { ...currentProfileData.account_aggregator, bank_statement_bounces: arr }
                            });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Credit Card/OD Utilization (%)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={currentProfileData.account_aggregator.credit_card_utilization_percent}
                          onChange={e => setCurrentProfileData({
                            ...currentProfileData,
                            account_aggregator: { ...currentProfileData.account_aggregator, credit_card_utilization_percent: parseFloat(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Data Form Editor Col 2 */}
              <div className="editor-card">
                <h4 className="editor-card-title">GST Tax Records</h4>
                <div className="consent-option-card" style={{ marginBottom: '1rem' }} onClick={() => {
                  const registered = !currentProfileData.gst.registered;
                  setCurrentProfileData({
                    ...currentProfileData,
                    gst: { ...currentProfileData.gst, registered }
                  });
                }}>
                  <input type="checkbox" checked={currentProfileData.gst.registered} className="consent-checkbox" readOnly />
                  <div className="option-details">
                    <span className="option-title">Register GST Filings</span>
                  </div>
                </div>

                {currentProfileData.gst.registered && (
                  <>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Annual GST Turnover (INR)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={currentProfileData.gst.annual_turnover_inr}
                          onChange={e => setCurrentProfileData({
                            ...currentProfileData,
                            gst: { ...currentProfileData.gst, annual_turnover_inr: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">YoY Growth (%)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={currentProfileData.gst.yoy_growth_percent}
                          onChange={e => setCurrentProfileData({
                            ...currentProfileData,
                            gst: { ...currentProfileData.gst, yoy_growth_percent: parseFloat(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Average Filing Delays (Days)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={
                          currentProfileData.gst.filing_delays_3b_days.length > 0 
                            ? Math.round(currentProfileData.gst.filing_delays_3b_days.reduce((a,b)=>a+b,0) / currentProfileData.gst.filing_delays_3b_days.length)
                            : 0
                        }
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          setCurrentProfileData({
                            ...currentProfileData,
                            gst: { ...currentProfileData.gst, filing_delays_3b_days: Array(12).fill(val) }
                          });
                        }}
                      />
                    </div>
                  </>
                )}

                <h4 className="editor-card-title" style={{ marginTop: '1.5rem' }}>UPI QR code Inflows</h4>
                <div className="consent-option-card" style={{ marginBottom: '1rem' }} onClick={() => {
                  const active = !currentProfileData.upi.active;
                  setCurrentProfileData({
                    ...currentProfileData,
                    upi: { ...currentProfileData.upi, active }
                  });
                }}>
                  <input type="checkbox" checked={currentProfileData.upi.active} className="consent-checkbox" readOnly />
                  <div className="option-details">
                    <span className="option-title">Link UPI Inflows</span>
                  </div>
                </div>

                {currentProfileData.upi.active && (
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Avg Monthly UPI Inflow (INR)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={currentProfileData.upi.avg_monthly_inflow_inr}
                        onChange={e => setCurrentProfileData({
                          ...currentProfileData,
                          upi: { ...currentProfileData.upi, avg_monthly_inflow_inr: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Monthly Transaction Count</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={currentProfileData.upi.monthly_transaction_count}
                        onChange={e => setCurrentProfileData({
                          ...currentProfileData,
                          upi: { ...currentProfileData.upi, monthly_transaction_count: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="btn-group" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button className="btn" onClick={() => setActiveTab('lender')}>
                Verify Updated Scoring Card <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: API Response */}
        {activeTab === 'api' && (
          <div className="card uli-payload-viewer">
            <div className="section-header">
              <div>
                <h2 className="section-title"><FileCode size={20} className="info-banner-icon" /> ULI/OCEN Interoperable payload API</h2>
                <p className="section-subtitle">JSON output compliant with Unified Lending Interface standards for instant bank connectivity.</p>
              </div>
            </div>

            <div className="info-banner">
              <Info size={20} className="info-banner-icon" />
              <div>
                <strong>Interoperable Open Banking Payload:</strong> Under India's ULI framework, lenders consume the financial health card as structured metadata. This JSON contains the header validation, confidence scores, and sub-score metrics.
              </div>
            </div>

            {assessmentResult ? (
              <pre className="json-block">
                {JSON.stringify(assessmentResult, null, 2)}
              </pre>
            ) : (
              <div className="empty-state">No payload available. Run assessment on Lender tab.</div>
            )}
          </div>
        )}

      </main>
      
      {/* Footer bar */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'auto' }}>
        🚀 Build completed for IDBI Innovate Hackathon submission template. MSME Financial Health Card credit engine.
      </footer>
    </div>
  );
}
