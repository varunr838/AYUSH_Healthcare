import pandas as pd
import numpy as np
from datetime import timedelta, date
import random

# 1. Setup Parameters
# Let's simulate an array of 777 pincodes (e.g., 632001 to 632777)
pincodes = [632000 + i for i in range(1, 778)] 
start_date = date(2024, 1, 1)
num_days = 730

print(f"Generating data for {len(pincodes)} pincodes over {num_days} days...")
print(f"Total expected rows: {len(pincodes) * num_days}")

# 2. Dynamic Outbreak Assignment (The Scale Fix)
# We randomly select 5% of the pincodes to be "vulnerable" to each outbreak.
# This gives the AI enough data to learn without overwhelming the healthy baseline.
num_vulnerable = int(len(pincodes) * 0.05) 

# Year 1 Outbreak Zones
yr1_dengue_zones = random.sample(pincodes, num_vulnerable)
yr1_cholera_zones = random.sample(pincodes, num_vulnerable)
yr1_flu_zones = random.sample(pincodes, num_vulnerable)

# Year 2 Outbreak Zones (Different pincodes to prove the AI generalizes)
yr2_dengue_zones = random.sample(pincodes, num_vulnerable)
yr2_cholera_zones = random.sample(pincodes, num_vulnerable)
yr2_flu_zones = random.sample(pincodes, num_vulnerable)

data = []

# 3. Generate Base Daily Data
for pincode in pincodes:
    for day in range(num_days):
        current_date = start_date + timedelta(days=day)
        month = current_date.month
        
        # Seasonal Weather Simulation
        if 6 <= month <= 9: # Monsoon
            temp = np.random.normal(28, 2)
            humidity = np.random.normal(85, 5)
            rainfall = np.random.exponential(15) if np.random.rand() > 0.3 else 0
        elif month in [12,1,2]: # Winter
            temp = np.random.normal(22, 2)
            humidity = np.random.normal(60, 5)
            rainfall = np.random.exponential(2) if np.random.rand() > 0.8 else 0
        else: # Summer
            temp = np.random.normal(35, 2)
            humidity = np.random.normal(50, 5)
            rainfall = 0

        # Baseline Symptom Clusters
        gastro_symptoms = int(np.random.poisson(5))
        respiratory_symptoms = int(np.random.poisson(10))
        vector_borne_symptoms = int(np.random.poisson(3))
        
        is_dengue = 0
        is_cholera = 0
        is_flu = 0
        
        # --- DYNAMIC OUTBREAK INJECTION ---
        
        # Year 1 Dengue (August)
        if pincode in yr1_dengue_zones:
            if date(2024, 7, 25) <= current_date <= date(2024, 8, 20):
                vector_borne_symptoms += int(np.random.poisson(25))
            if date(2024, 8, 1) <= current_date <= date(2024, 8, 20):
                is_dengue = 1

        # Year 1 Cholera (June)
        if pincode in yr1_cholera_zones:
            if date(2024, 6, 10) <= current_date <= date(2024, 6, 30):
                gastro_symptoms += int(np.random.poisson(30))
            if date(2024, 6, 15) <= current_date <= date(2024, 6, 30):
                is_cholera = 1

        # Year 1 Flu (November)
        if pincode in yr1_flu_zones:
            if date(2024, 11, 5) <= current_date <= date(2024, 11, 25):
                respiratory_symptoms += int(np.random.poisson(35))
            if date(2024, 11, 10) <= current_date <= date(2024, 11, 25):
                is_flu = 1

        # Year 2 Dengue (September)
        if pincode in yr2_dengue_zones:
            if date(2025, 8, 25) <= current_date <= date(2025, 9, 15):
                vector_borne_symptoms += int(np.random.poisson(28))
            if date(2025, 9, 1) <= current_date <= date(2025, 9, 15):
                is_dengue = 1

        # Year 2 Cholera (October)
        if pincode in yr2_cholera_zones:
            if date(2025, 10, 5) <= current_date <= date(2025, 10, 20):
                gastro_symptoms += int(np.random.poisson(25))
            if date(2025, 10, 10) <= current_date <= date(2025, 10, 20):
                is_cholera = 1

        # Year 2 Flu (December)
        if pincode in yr2_flu_zones:
            if date(2025, 12, 1) <= current_date <= date(2025, 12, 20):
                respiratory_symptoms += int(np.random.poisson(30))
            if date(2025, 12, 6) <= current_date <= date(2025, 12, 20):
                is_flu = 1

        data.append([
            current_date, pincode, temp, humidity, rainfall, 
            gastro_symptoms, respiratory_symptoms, vector_borne_symptoms, 
            is_dengue, is_cholera, is_flu
        ])

# 4. Create DataFrame and Calculate Lags
print("Building DataFrame...")
df = pd.DataFrame(data, columns=[
    'date', 'pincode', 'temp_c', 'humidity_pct', 'rainfall_mm',
    'cluster_gastro', 'cluster_respiratory', 'cluster_vector_borne', 
    'is_dengue_outbreak', 'is_cholera_outbreak', 'is_influenza_outbreak'
])

print("Calculating rolling features... (This may take 15-30 seconds)")
df = df.sort_values(by=['pincode', 'date'])
symptom_cols = ['cluster_vector_borne', 'cluster_gastro', 'cluster_respiratory']

for col in symptom_cols:
    df[f'{col}_3d_lag'] = df.groupby('pincode')[col].transform(
        lambda x: x.shift(1).rolling(window=3, min_periods=1).sum()
    ).fillna(0)
    df[f'{col}_7d_lag'] = df.groupby('pincode')[col].transform(
        lambda x: x.shift(1).rolling(window=7, min_periods=1).sum()
    ).fillna(0)

df = df.sort_values(by='date')
df.to_csv('ayush_scaled_777_data.csv', index=False)
print("Complete! Scaled dataset saved.")