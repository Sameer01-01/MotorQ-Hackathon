import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import os

def generate_synthetic_training_data(n_samples=10000):
    """
    Generate synthetic feature data that mimics rolling window aggregations
    from the telemetry data. This is our 'Lite' workaround to avoid 
    processing millions of rows of historical DuckDB data while still
    running a mathematically real training step.
    """
    np.random.seed(42)
    
    # Base features (healthy)
    coolant_mean = np.random.normal(85, 5, n_samples)
    coolant_max = coolant_mean + np.random.normal(5, 2, n_samples)
    voltage_mean = np.random.normal(14.2, 0.2, n_samples)
    dtc_count = np.random.poisson(0.1, n_samples)
    odometer = np.random.uniform(10000, 150000, n_samples)
    age_years = np.random.uniform(1, 10, n_samples)
    
    y = np.zeros(n_samples, dtype=int)
    
    # Inject overheating failures (high coolant)
    overheat_idx = np.random.choice(n_samples, int(n_samples * 0.1), replace=False)
    coolant_mean[overheat_idx] += np.random.uniform(15, 25, len(overheat_idx))
    coolant_max[overheat_idx] += np.random.uniform(20, 30, len(overheat_idx))
    y[overheat_idx] = 1
    
    # Inject battery failures (voltage sag)
    sag_idx = np.random.choice(n_samples, int(n_samples * 0.1), replace=False)
    voltage_mean[sag_idx] -= np.random.uniform(2.0, 3.5, len(sag_idx))
    y[sag_idx] = 1
    
    # Inject misfire failures (high dtc count)
    misfire_idx = np.random.choice(n_samples, int(n_samples * 0.05), replace=False)
    dtc_count[misfire_idx] += np.random.poisson(4, len(misfire_idx))
    y[misfire_idx] = 1
    
    df = pd.DataFrame({
        'coolant_mean': coolant_mean,
        'coolant_max': coolant_max,
        'voltage_mean': voltage_mean,
        'dtc_count': dtc_count,
        'odometer': odometer,
        'age_years': age_years
    })
    
    return df, y

def train_and_evaluate():
    print("Generating synthetic feature history...")
    X, y = generate_synthetic_training_data(20000)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest model...")
    model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    # Baseline comparison (Threshold Rule: coolant > 105 or voltage < 12.5 or dtc >= 3)
    baseline_pred = ((X_test['coolant_max'] > 105) | (X_test['voltage_mean'] < 12.5) | (X_test['dtc_count'] >= 3)).astype(int)
    baseline_acc = accuracy_score(y_test, baseline_pred)
    
    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "roc_auc": float(roc_auc_score(y_test, y_prob)),
        "baseline_accuracy": float(baseline_acc),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "feature_importances": dict(zip(X.columns, model.feature_importances_))
    }
    
    # Save artifacts
    os.makedirs('services/ml/artifacts', exist_ok=True)
    with open('services/ml/artifacts/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
        
    joblib.dump(model, 'services/ml/artifacts/risk_model.joblib')
    
    print("Training complete! Metrics saved.")
    print(f"Model Accuracy: {metrics['accuracy']:.3f} | Baseline Accuracy: {metrics['baseline_accuracy']:.3f}")

if __name__ == "__main__":
    train_and_evaluate()
