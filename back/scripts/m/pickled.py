# -*- coding: utf-8 -*-
"""pickled.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1rDO4woAgcVqWbNPD6cmWTHUU0RWY3fLD

# Road Accident Severity Classification
"""

# Commented out IPython magic to ensure Python compatibility.
#import the necessary Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import time
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler,MinMaxScaler,LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier,AdaBoostClassifier,GradientBoostingClassifier
from sklearn.metrics import accuracy_score,classification_report,confusion_matrix
from sklearn.model_selection import KFold # import KFold
import warnings
import pickle
warnings.filterwarnings('ignore')
# %matplotlib inline

df = pd.read_csv("RTA Dataset.csv")

"""#### Let's take a look at the dataset"""

# convert the 'Date' column to datetime format
df['Time']= pd.to_datetime(df['Time'])

"""### Categorical data analysis"""

# dropping columns that can cause imbalance while imputation
lists=['Vehicle_driver_relation', 'Work_of_casuality', 'Fitness_of_casuality','Day_of_week','Casualty_severity','Time','Sex_of_driver','Educational_level','Defect_of_vehicle','Owner_of_vehicle','Service_year_of_vehicle', 'Road_surface_type','Sex_of_casualty']
df.drop(columns = lists, inplace=True)

"""### Filling missing values"""

# fill missing values with mean column values
df['Driving_experience'].fillna(df['Driving_experience'].mode()[0], inplace=True)
df['Age_band_of_driver'].fillna(df['Age_band_of_driver'].mode()[0], inplace=True)
df['Type_of_vehicle'].fillna(df['Type_of_vehicle'].mode()[0], inplace=True)
df['Area_accident_occured'].fillna(df['Area_accident_occured'].mode()[0], inplace=True)
df['Road_allignment'].fillna(df['Road_allignment'].mode()[0], inplace=True)
df['Type_of_collision'].fillna(df['Type_of_collision'].mode()[0], inplace=True)
df['Vehicle_movement'].fillna(df['Vehicle_movement'].mode()[0], inplace=True)
df['Lanes_or_Medians'].fillna(df['Lanes_or_Medians'].mode()[0], inplace=True)
df['Types_of_Junction'].fillna(df['Types_of_Junction'].mode()[0], inplace=True)

df_sample = df.sample(20)

"""### Encoding"""

from sklearn.preprocessing import OrdinalEncoder
enc = OrdinalEncoder()

cols = df.columns

x = enc.fit_transform(df)

pickle.dump(enc,open('Oencoder.pkl','wb'))

xd = pd.DataFrame(x,columns=cols)

df = xd

"""## Splitting test and train data"""

x=df.drop(columns=["Accident_severity"])
y=df["Accident_severity"]

xtrain,xtest,ytrain,ytest=train_test_split(x,y,test_size=0.2,random_state=0)

model_pipeline=Pipeline([('MinMaxScler',MinMaxScaler()),('model',GradientBoostingClassifier())])
model_fit=model_pipeline.fit(xtrain,ytrain)

pickle.dump(model_fit,open('model.sav','wb'))

ypred=model_fit.predict(xtest)

acc=accuracy_score(ytest,ypred)

acc

"""Import pickled model"""

OE_save = pickle.load(open('Oencoder.pkl','rb'))

model=pickle.load(open('model.sav','rb'))

# load your test dataset here
df_sample

# convert numpy array to pandas dataframe
 df_sample_tf = enc.transform(df_sample)
 xs = pd.DataFrame(df_sample_tf,columns=cols)

test = xs["Accident_severity"]
dfx = xs.drop(columns=["Accident_severity"])

predictions=model.predict(dfx)

accuracy = accuracy_score(test,predictions)

accuracy

print(predictions)

# add prediction column to df
# invert the df
dfx["Accident_severity"] = predictions
inv_array = OE_save.inverse_transform(dfx)
inv_df = pd.DataFrame(inv_array,columns=cols)

inv_df

