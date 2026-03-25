import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# 1. Load the synthetic dataset generated in the previous step
print("Loading dataset...")
df = pd.read_csv('ayush_3_disease_outbreak_data.csv') # Assuming you saved it as this

# 2. Define Features (X) and Targets (y)
# We drop 'date' and 'pincode' because they are identifiers, not predictive math features.
# We also drop the target columns from the input.
X = df.drop(columns=['date', 'pincode', 'is_dengue_outbreak', 'is_cholera_outbreak', 'is_influenza_outbreak'])

y = df[['is_dengue_outbreak', 'is_cholera_outbreak', 'is_influenza_outbreak']]

# 3. Time-Series Train/Test Split (CRITICAL for Hackathons)
# We CANNOT use a random shuffle here. If we shuffle, the model will learn from the "future" 
# to predict the "past". We must train on the first 80% of days and test on the last 20%.
print("Splitting data into training and testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# 4. Initialize the Model
# 'class_weight="balanced"' is the magic parameter here. Because outbreaks are rare (mostly 0s, a few 1s),
# this tells the AI to pay extra attention to the 1s so it doesn't just guess "No Outbreak" every time.
print("Initializing Random Forest Model...")
model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)

# 5. Train the Model
print("Training the model... (This might take a few seconds)")
model.fit(X_train, y_train)

# 6. Evaluate the Model
print("\n--- Model Evaluation ---")
y_pred = model.predict(X_test)

# Evaluate each disease separately
target_names = ['Dengue', 'Cholera', 'Influenza']
for i, disease in enumerate(target_names):
    print(f"\nClassification Report for {disease}:")
    # We look at the specific column 'i' in our multi-output predictions
    print(classification_report(y_test.iloc[:, i], y_pred[:, i], zero_division=0))

# 7. Save the Model for the Backend
print("\nSaving the trained model for the backend to use...")
joblib.dump(model, 'ayush_outbreak_model.pkl')
print("Model successfully saved as 'ayush_outbreak_model.pkl'!")