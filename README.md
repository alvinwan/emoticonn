# Emoticonn
Prototypes and related source code for the Emoticonn project

# Install

Create your Anaconda environment.

```
conda create -n emoticonn python=3.4
```

Next, activate your environment.

```
source activate emoticonn
```

Install Python dependencies.

```
pip install -r requirements.txt
```

# Directory Structure

## `statics/`

This folder contains all four prototype statics. These statics are not ready for public consumption; they still contain PIIs.

## `features/`

This folder contains a random collection of features. Some may simply be imported from Python libraries.

## `naiivebayes/`

This Naiive Bayes implements a bag-of-words model to predict the predominant reaction for a post, excluding "Like"s.
