# d:\Idbi\backend\scoring_engine.py
import numpy as np

def calculate_liquidity(profile):
    shap_contributions = []
    base_score = 70.0
    
    # 1. DSCR Contribution
    dscr = profile["account_aggregator"].get("dscr", 1.0) if profile["account_aggregator"]["linked"] else 1.0
    if dscr >= 2.0:
        dscr_contrib = 18.0
    elif dscr >= 1.5:
        dscr_contrib = 10.0
    elif dscr >= 1.0:
        dscr_contrib = -5.0
    else:
        dscr_contrib = -20.0
    shap_contributions.append({"feature": "Debt Service Coverage Ratio (DSCR)", "value": dscr_contrib})
    
    # 2. Average Daily Balance (ADB) vs Monthly Inflow
    adb = profile["account_aggregator"].get("avg_daily_balance_inr", 0) if profile["account_aggregator"]["linked"] else 0
    upi_inflow = profile["upi"].get("avg_monthly_inflow_inr", 0) if profile["upi"]["active"] else 0
    gst_turnover = profile["gst"].get("annual_turnover_inr", 0) if profile["gst"]["registered"] else 0
    monthly_sales_est = max(upi_inflow, gst_turnover / 12.0, 10000)
    
    adb_ratio = adb / monthly_sales_est
    if adb_ratio >= 0.3:
        adb_contrib = 12.0
    elif adb_ratio >= 0.15:
        adb_contrib = 5.0
    elif adb_ratio >= 0.05:
        adb_contrib = -2.0
    else:
        adb_contrib = -15.0
    shap_contributions.append({"feature": "Average Daily Balance Ratio", "value": adb_contrib})
    
    # 3. UPI Inflows
    if profile["upi"]["active"]:
        inflow = profile["upi"]["avg_monthly_inflow_inr"]
        if inflow >= 1000000:
            upi_contrib = 10.0
        elif inflow >= 500000:
            upi_contrib = 5.0
        else:
            upi_contrib = 0.0
    else:
        upi_contrib = -5.0
    shap_contributions.append({"feature": "UPI Cash Inflow Volume", "value": upi_contrib})
    
    subscore = base_score + dscr_contrib + adb_contrib + upi_contrib
    subscore = max(0, min(100, subscore))
    
    return subscore, shap_contributions

def calculate_stability(profile):
    shap_contributions = []
    base_score = 65.0
    
    # 1. Vintage
    vintage = profile.get("vintage_months", 12)
    if vintage >= 60:
        vintage_contrib = 20.0
    elif vintage >= 36:
        vintage_contrib = 12.0
    elif vintage >= 24:
        vintage_contrib = 5.0
    elif vintage >= 12:
        vintage_contrib = -5.0
    else:
        vintage_contrib = -15.0
    shap_contributions.append({"feature": "Business Vintage (Months)", "value": vintage_contrib})
    
    # 2. EPFO Headcount Stability
    if profile["epfo"]["registered"] and profile["epfo"]["headcount_trend_12m"]:
        trend = profile["epfo"]["headcount_trend_12m"]
        # Coefficient of variation (standard deviation / mean)
        mean_hc = np.mean(trend)
        std_hc = np.std(trend)
        cv = std_hc / mean_hc if mean_hc > 0 else 0
        
        # Stability is high if employee count is stable (low CV) or increasing
        growth = trend[-1] - trend[0]
        if cv < 0.05:
            hc_contrib = 10.0
        elif cv < 0.15:
            hc_contrib = 5.0
        else:
            hc_contrib = -5.0
            
        if growth > 0:
            hc_contrib += 5.0  # Growth bonus
        elif growth < 0:
            hc_contrib -= 10.0 # Layoffs penalty
    else:
        # Thin data or unregistered EPFO
        hc_contrib = -5.0
    shap_contributions.append({"feature": "EPFO Headcount Stability & Trend", "value": hc_contrib})
    
    # 3. Business Constitution
    const = profile.get("constitution", "Proprietorship")
    if const == "Private Limited":
        const_contrib = 10.0
    elif const == "Partnership":
        const_contrib = 5.0
    else:
        const_contrib = 0.0
    shap_contributions.append({"feature": "Legal Constitution Type", "value": const_contrib})
    
    subscore = base_score + vintage_contrib + hc_contrib + const_contrib
    subscore = max(0, min(100, subscore))
    
    return subscore, shap_contributions

def calculate_growth(profile):
    shap_contributions = []
    base_score = 60.0
    
    # 1. GST YoY growth
    if profile["gst"]["registered"]:
        growth = profile["gst"]["yoy_growth_percent"]
        if growth >= 25.0:
            gst_growth_contrib = 25.0
        elif growth >= 10.0:
            gst_growth_contrib = 15.0
        elif growth >= 0.0:
            gst_growth_contrib = 5.0
        else:
            gst_growth_contrib = -15.0
    else:
        gst_growth_contrib = 0.0 # Neutral if not registered, evaluated on UPI
    shap_contributions.append({"feature": "YoY GST Revenue Growth", "value": gst_growth_contrib})
    
    # 2. UPI Inflow Growth
    if profile["upi"]["active"]:
        upi_growth = profile["upi"]["inflow_growth_percent"]
        if upi_growth >= 25.0:
            upi_growth_contrib = 15.0
        elif upi_growth >= 10.0:
            upi_growth_contrib = 8.0
        elif upi_growth >= 0.0:
            upi_growth_contrib = 2.0
        else:
            upi_growth_contrib = -10.0
    else:
        upi_growth_contrib = -5.0
    shap_contributions.append({"feature": "UPI Inflow Growth Trend", "value": upi_growth_contrib})
    
    # 3. Transaction count trend (velocity)
    tx_count = profile["upi"].get("monthly_transaction_count", 0)
    if tx_count >= 500:
        tx_contrib = 10.0
    elif tx_count >= 100:
        tx_contrib = 5.0
    else:
        tx_contrib = -5.0
    shap_contributions.append({"feature": "Transaction Velocity (Monthly Count)", "value": tx_contrib})
    
    subscore = base_score + gst_growth_contrib + upi_growth_contrib + tx_contrib
    subscore = max(0, min(100, subscore))
    
    return subscore, shap_contributions

def calculate_compliance(profile):
    shap_contributions = []
    base_score = 75.0
    
    # 1. GST Filing Delays (Average delays)
    if profile["gst"]["registered"] and profile["gst"]["filing_delays_3b_days"]:
        delays = profile["gst"]["filing_delays_3b_days"]
        avg_delay = np.mean(delays)
        if avg_delay == 0:
            gst_delay_contrib = 15.0
        elif avg_delay <= 3:
            gst_delay_contrib = 5.0
        elif avg_delay <= 10:
            gst_delay_contrib = -10.0
        else:
            gst_delay_contrib = -25.0
    else:
        gst_delay_contrib = 0.0 # Neutral or missing
    shap_contributions.append({"feature": "GST Filing Delay Consistency (GSTR-3B)", "value": gst_delay_contrib})
    
    # 2. EPFO Contribution Delays
    if profile["epfo"]["registered"] and profile["epfo"]["contribution_delays_days"]:
        delays = profile["epfo"]["contribution_delays_days"]
        avg_delay = np.mean(delays)
        if avg_delay == 0:
            epfo_contrib = 10.0
        elif avg_delay <= 5:
            epfo_contrib = 0.0
        else:
            epfo_contrib = -15.0
    else:
        epfo_contrib = 0.0
    shap_contributions.append({"feature": "EPFO Compliance (Deposit Delay)", "value": epfo_contrib})
    
    # 3. Tax to Turnover Ratio (Normal range 2% - 15% depending on sector)
    if profile["gst"]["registered"]:
        tax_ratio = profile["gst"].get("tax_to_turnover_ratio", 0.0)
        if tax_ratio >= 0.03:
            tax_contrib = 5.0
        elif tax_ratio > 0:
            tax_contrib = 0.0
        else:
            tax_contrib = -10.0
    else:
        tax_contrib = -5.0
    shap_contributions.append({"feature": "Tax Compliance (Tax to Turnover Ratio)", "value": tax_contrib})
    
    subscore = base_score + gst_delay_contrib + epfo_contrib + tax_contrib
    subscore = max(0, min(100, subscore))
    
    return subscore, shap_contributions

def calculate_repayment(profile):
    shap_contributions = []
    base_score = 80.0
    
    # 1. Bank statement bounces (last 12 months)
    if profile["account_aggregator"]["linked"]:
        bounces = profile["account_aggregator"].get("bank_statement_bounces", [])
        total_bounces = sum(bounces)
        if total_bounces == 0:
            bounce_contrib = 15.0
        elif total_bounces <= 2:
            bounce_contrib = -10.0
        elif total_bounces <= 5:
            bounce_contrib = -25.0
        else:
            bounce_contrib = -45.0
    else:
        bounce_contrib = -10.0 # Penalty for no bank statement verification
    shap_contributions.append({"feature": "Bank Statement Inward Debit Bounces", "value": bounce_contrib})
    
    # 2. Credit Card / Overdraft Utilization
    if profile["account_aggregator"]["linked"]:
        util = profile["account_aggregator"].get("credit_card_utilization_percent", 0.0)
        if util <= 30.0:
            util_contrib = 5.0
        elif util <= 50.0:
            util_contrib = 0.0
        elif util <= 80.0:
            util_contrib = -15.0
        else:
            util_contrib = -30.0
    else:
        util_contrib = 0.0
    shap_contributions.append({"feature": "Overdraft / Credit Card Utilization", "value": util_contrib})
    
    # 3. Active Debt Obligations vs DSCR
    if profile["account_aggregator"]["linked"]:
        active_loans = profile["account_aggregator"].get("active_loans_count", 0)
        dscr = profile["account_aggregator"].get("dscr", 1.0)
        if active_loans == 0:
            loan_contrib = 5.0
        elif active_loans <= 2 and dscr >= 1.5:
            loan_contrib = 0.0
        else:
            loan_contrib = -10.0
    else:
        loan_contrib = -5.0
    shap_contributions.append({"feature": "Existing Debt Leverage Burden", "value": loan_contrib})
    
    subscore = base_score + bounce_contrib + util_contrib + loan_contrib
    subscore = max(0, min(100, subscore))
    
    return subscore, shap_contributions

def compute_full_assessment(profile, weights=None):
    if weights is None:
        weights = {
            "liquidity": 0.20,
            "stability": 0.20,
            "growth": 0.20,
            "compliance": 0.20,
            "repayment": 0.20
        }
    else:
        # Normalize weights to sum to 1.0
        total_w = sum(weights.values())
        if total_w > 0:
            weights = {k: v / total_w for k, v in weights.items()}
        else:
            weights = {k: 0.20 for k in weights}

    # Calculate subscores and feature attributions
    liq_score, liq_shap = calculate_liquidity(profile)
    stab_score, stab_shap = calculate_stability(profile)
    growth_score, growth_shap = calculate_growth(profile)
    comp_score, comp_shap = calculate_compliance(profile)
    repay_score, repay_shap = calculate_repayment(profile)
    
    # Calculate Data Confidence Score
    confidence_factors = {
        "gst_registered": 30 if profile["gst"]["registered"] else 0,
        "epfo_registered": 20 if profile["epfo"]["registered"] else 0,
        "aa_linked": 30 if profile["account_aggregator"]["linked"] else 0,
        "upi_active": 20 if profile["upi"]["active"] else 0
    }
    confidence_score = sum(confidence_factors.values())
    
    # Flags based on confidence and scoring thresholds
    risk_flags = []
    strength_flags = []
    
    # Formulate flags based on metrics
    if profile["account_aggregator"]["linked"]:
        bounces = sum(profile["account_aggregator"].get("bank_statement_bounces", []))
        if bounces > 3:
            risk_flags.append({"severity": "HIGH", "source": "Account Aggregator", "message": f"Frequent bank statement bounces ({bounces} times in 12 months) indicates liquidity strain."})
        elif bounces > 0:
            risk_flags.append({"severity": "MEDIUM", "source": "Account Aggregator", "message": "Minor bank account debit bounces detected."})
        else:
            strength_flags.append({"source": "Account Aggregator", "message": "Clean repayment track record with zero debit bounces."})
            
        dscr = profile["account_aggregator"].get("dscr", 1.0)
        if dscr < 1.0:
            risk_flags.append({"severity": "HIGH", "source": "Account Aggregator", "message": f"Debt Service Coverage Ratio (DSCR: {dscr}) is below unit threshold."})
        elif dscr >= 2.0:
            strength_flags.append({"source": "Account Aggregator", "message": f"Strong debt service coverage (DSCR: {dscr}x)."})
            
    if profile["gst"]["registered"]:
        growth = profile["gst"]["yoy_growth_percent"]
        if growth > 20:
            strength_flags.append({"source": "GSTN", "message": f"Outstanding Year-on-Year growth of {growth}%."})
        elif growth < 0:
            risk_flags.append({"severity": "MEDIUM", "source": "GSTN", "message": f"Contracting year-on-year business turnover ({growth}%)."})
            
        delays = profile["gst"]["filing_delays_3b_days"]
        if delays and np.mean(delays) > 10:
            risk_flags.append({"severity": "HIGH", "source": "GSTN", "message": f"Consistent GST filing delays (Average: {int(np.mean(delays))} days delay)."})
        elif delays and np.mean(delays) == 0:
            strength_flags.append({"source": "GSTN", "message": "Punctual tax filings with zero GSTR-3B delays."})

    if profile["epfo"]["registered"]:
        employees = profile["epfo"]["active_employees"]
        if employees > 20:
            strength_flags.append({"source": "EPFO", "message": f"Healthy corporate scale with {employees} active employees."})
            
        trend = profile["epfo"]["headcount_trend_12m"]
        if len(trend) > 1 and trend[-1] < trend[0] * 0.8:
            risk_flags.append({"severity": "HIGH", "source": "EPFO", "message": "Significant employee count contraction (>20% reduction) in past 12 months."})
            
    if confidence_score < 70:
        risk_flags.append({"severity": "MEDIUM", "source": "System Gate", "message": f"Thin-file profile (Confidence score: {confidence_score}%). Scored provisionally due to missing GST or EPFO records."})
    
    # Calculate Overall Weighted Score
    # Map overall score from [0, 100] to standard Indian credit score range [300, 900]
    weighted_subscore = (
        liq_score * weights["liquidity"] +
        stab_score * weights["stability"] +
        growth_score * weights["growth"] +
        comp_score * weights["compliance"] +
        repay_score * weights["repayment"]
    )
    
    overall_score = int(300 + (weighted_subscore / 100.0) * 600)
    
    # Return consolidated dictionary
    return {
        "business_name": profile["business_name"],
        "constitution": profile["constitution"],
        "sector": profile["sector"],
        "vintage_months": profile["vintage_months"],
        "overall_score": overall_score,
        "is_provisional": confidence_score < 70,
        "confidence_score": confidence_score,
        "weights": weights,
        "sub_scores": {
            "liquidity": round(liq_score, 1),
            "stability": round(stab_score, 1),
            "growth": round(growth_score, 1),
            "compliance": round(comp_score, 1),
            "repayment": round(repay_score, 1)
        },
        "shap_values": {
            "liquidity": liq_shap,
            "stability": stab_shap,
            "growth": growth_shap,
            "compliance": comp_shap,
            "repayment": repay_shap
        },
        "risk_flags": risk_flags,
        "strength_flags": strength_flags
    }
