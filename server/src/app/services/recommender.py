import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.neighbors import NearestNeighbors

lines = sys.stdin.readlines()

# get data
items_data = json.loads(lines[1].strip())
user_interests_data = json.loads(lines[2].strip())


# Create a DataFrame for item data and user_interests_data
items_df = pd.DataFrame(items_data)
user_interests_df = pd.DataFrame(user_interests_data)

# Create a TF-IDF vectorizer to convert item genres into numerical vectors
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
item_tfidf_matrix = tfidf_vectorizer.fit_transform(items_df['genres'].apply(lambda x: ' '.join(x)))

# Compute the cosine similarity between item genres
cosine_sim = linear_kernel(item_tfidf_matrix, item_tfidf_matrix)

# Create a user profile based on interests
def get_user_profile(user_id):
    user_interests = user_interests_df[user_interests_df['_id'] == user_id]['interests'].values[0]
    # user_visited   = user_interests_df[user_interests_df['_id'] == user_id]['visited'].values[0]
    # items_visited  = [item for item in items_df if item["id"] in user_visited]
    # items_genres   = [item["name"] for item in result_items]
    # consume_data = user_interests + user_visited

    return tfidf_vectorizer.transform([' '.join(user_interests)])

# Calculate the number of samples (items)
n_samples = len(items_df)

# Determine the appropriate value for n_neighbors
n_neighbors = min(10, n_samples)

# Create a Nearest Neighbors model based on cosine similarity
nn_model = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine', algorithm='brute')
nn_model.fit(item_tfidf_matrix)

# Function to get item recommendations for a user
def get_item_recommendations(user_id):
    user_profile = get_user_profile(user_id)
    
    # Find similar items based on user's interests
    item_indices = nn_model.kneighbors(user_profile, n_neighbors=n_neighbors)[1][0]
    
    # Get the liked items of the user
    liked_items = user_interests_df[user_interests_df['_id'] == user_id]['liked'].values[0]
    
    # Filter out items that the user has already liked
    recommended_items = [items_data[idx] for idx in item_indices if items_data[idx]['_id'] not in liked_items]
    
    return recommended_items

# Get recommendations for a user (with the target user ID)
target_user_id = json.loads(lines[0].strip())
recommendations = get_item_recommendations(target_user_id)

print(json.dumps(recommendations, ensure_ascii=False))
