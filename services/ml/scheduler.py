import yaml

def load_cost_model():
    # Fallback default if no yaml exists
    return {
        "cost_of_breakdown_inr": 50000,
        "cost_of_preventative_inr": 10000,
        "hours_per_preventative": 2.5
    }

def optimize_schedule(vehicles_with_risk: list, capacity_hours: float):
    """
    0/1 Knapsack DP Scheduler
    vehicles_with_risk: list of dicts [{'vin': str, 'prob': float}]
    """
    costs = load_cost_model()
    
    # 1 item = 1 vehicle. Weight = hours. Value = Expected Savings
    # Expected Savings = (Prob * BreakdownCost) - PreventativeCost
    
    items = []
    for v in vehicles_with_risk:
        prob = v['prob']
        # If savings < 0, it's not worth fixing preventatively
        expected_savings = (prob * costs["cost_of_breakdown_inr"]) - costs["cost_of_preventative_inr"]
        if expected_savings > 0:
            items.append({
                "vin": v["vin"],
                "weight": costs["hours_per_preventative"],
                "value": expected_savings,
                "prob": prob
            })
            
    # DP needs integer weights. Let's multiply hours by 10 (e.g. 2.5 hr -> 25)
    W = int(capacity_hours * 10)
    n = len(items)
    
    # Initialize DP table
    dp = [[0.0 for _ in range(W + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        wt = int(items[i-1]["weight"] * 10)
        val = items[i-1]["value"]
        
        for w in range(W + 1):
            if wt <= w:
                dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt] + val)
            else:
                dp[i][w] = dp[i-1][w]
                
    # Backtrack to find selected items
    res = dp[n][W]
    w = W
    selected_vins = set()
    
    for i in range(n, 0, -1):
        if res <= 0:
            break
        if res == dp[i-1][w]:
            continue
        else:
            wt = int(items[i-1]["weight"] * 10)
            selected_vins.add(items[i-1]["vin"])
            res -= items[i-1]["value"]
            w -= wt
            
    # Compare with Baselines
    # Baseline 1: Top-K by risk (greedy)
    sorted_by_risk = sorted(items, key=lambda x: x["prob"], reverse=True)
    greedy_val = 0
    greedy_w = 0
    greedy_selected = set()
    for item in sorted_by_risk:
        wt = int(item["weight"] * 10)
        if greedy_w + wt <= W:
            greedy_w += wt
            greedy_val += item["value"]
            greedy_selected.add(item["vin"])
            
    return {
        "dp_selected_vins": list(selected_vins),
        "dp_total_savings": dp[n][W],
        "greedy_total_savings": greedy_val,
        "capacity_hours": capacity_hours,
        "cost_model": costs
    }
