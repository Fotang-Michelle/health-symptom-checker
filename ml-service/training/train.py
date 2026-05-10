import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib
import numpy as np

BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
DATA_PATH     = os.path.join(BASE_DIR, "data", "symptoms_dataset.csv")
MODEL_DIR     = os.path.join(BASE_DIR, "..", "app", "model")
MODEL_PATH    = os.path.join(MODEL_DIR, "disease_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.pkl")
ENCODER_PATH  = os.path.join(MODEL_DIR, "label_encoder.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

# STEP 1 - Load dataset
print("\n📂 STEP 1: Loading dataset...")
df = pd.read_csv(DATA_PATH)
print(f"   Rows: {len(df)}")
print(f"   Diseases: {list(df['disease'].unique())}")
print(f"   Rows per disease:")
for disease, count in df['disease'].value_counts().items():
    print(f"     {disease}: {count}")

# STEP 2 - Preprocessing
print("\n⚙️  STEP 2: Preprocessing...")
X             = df.drop(columns=["disease"])
y             = df["disease"]
feature_names = list(X.columns)
print(f"   Features: {len(feature_names)}")
print(f"   Missing values: {X.isnull().sum().sum()}")
encoder   = LabelEncoder()
y_encoded = encoder.fit_transform(y)
print(f"   Classes: {list(encoder.classes_)}")

# STEP 3 - Split data
print("\n✂️  STEP 3: Splitting data 80/20...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)
print(f"   Train: {len(X_train)}   Test: {len(X_test)}")

# STEP 4 - Train Random Forest
print("\n🌲 STEP 4: Training Random Forest...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train, y_train)
print("   Training complete.")

# STEP 5 - Evaluate
print("\n📊 STEP 5: Evaluating...")
y_pred   = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"   Test Accuracy: {accuracy * 100:.1f}%")

cv_scores = cross_val_score(model, X, y_encoded, cv=5)
print(f"   Cross-validation: {cv_scores.mean()*100:.1f}% (+/- {cv_scores.std()*100:.1f}%)")

print("\n   Classification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=encoder.classes_,
    zero_division=0
))

print("   Top 10 most important features:")
importances = model.feature_importances_
indices     = np.argsort(importances)[::-1][:10]
for i in indices:
    print(f"     {feature_names[i]:<25} {importances[i]:.3f}")

# STEP 6 - Save model
print("\n💾 STEP 6: Saving model...")
joblib.dump(model,         MODEL_PATH)
joblib.dump(feature_names, FEATURES_PATH)
joblib.dump(encoder,       ENCODER_PATH)
print(f"   Saved to: {MODEL_DIR}")
print("\n✅ Training complete!\n")