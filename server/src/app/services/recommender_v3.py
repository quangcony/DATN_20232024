# %%
import json
import sys
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import precision_score
from sklearn.metrics.pairwise import cosine_similarity

lines = sys.stdin.readlines()

# get data
items_data = json.loads(lines[1].strip())
user_data = json.loads(lines[2].strip())
interaction_data = json.loads(lines[3].strip())

user_df = pd.DataFrame(user_data)
items_df = pd.DataFrame(items_data)
interactions_df = pd.DataFrame(interaction_data)


# %%
# Merge order and order_detail to get purchase history
like_history = pd.merge(interactions_df[interactions_df['status'] == 1], items_df, left_on='campaignId', right_on='_id', how='inner')[['userId', 'campaignId']]

# Create a user-item matrix (binary representation)
user_item_matrix = like_history.pivot_table(index='userId', columns='campaignId', aggfunc='size', fill_value=0)

# Calculate cosine similarity between users
user_similarity = cosine_similarity(user_item_matrix)

# Map actual user IDs to a range of integers
user_id_to_index = {user_id: index for index, user_id in enumerate(user_item_matrix.index)}

# Function to get similar users
def get_similar_users(user_id, threshold=0.2):
    if user_id not in user_id_to_index:
        return []

    user_index = user_id_to_index[user_id]
    similar_users = user_similarity[user_index]
    similar_users = [(i, score) for i, score in enumerate(similar_users) if i != user_index and score >= threshold]
    similar_users.sort(key=lambda x: x[1], reverse=True)
    return similar_users


# %%
# Function to recommend products based on similar users
def recommend_projects_by_user(user_id, num_recommendations=10, threshold=0.2):
    similar_users = get_similar_users(user_id, threshold)

    user_likes = set(like_history[like_history['userId'] == user_id]['campaignId'])

    recommendations = []
    for similar_user_index, similarity_score in similar_users:
        similar_user_id = user_item_matrix.index[similar_user_index]
        similar_user_likes = set(like_history[like_history['userId'] == similar_user_id]['campaignId'])
        new_items = similar_user_likes - user_likes
        recommendations.extend(new_items)

        if len(recommendations) >= num_recommendations:
            break

    return recommendations[:num_recommendations]

# %%
# Create a TF-IDF vectorizer to convert item genres into numerical vectors
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
item_tfidf_matrix = tfidf_vectorizer.fit_transform(items_df['genres'].apply(lambda x: ' '.join(x)))

# Compute the cosine similarity between item genres
cosine_sim = linear_kernel(item_tfidf_matrix, item_tfidf_matrix)

# %%
def get_user_profile(user_id):
    user_interests = user_df[user_df['_id'] == user_id]['interests'].values[0]

    return tfidf_vectorizer.transform([' '.join(user_interests)])

# Calculate the number of samples (items)
n_samples = len(items_df)

# Determine the appropriate value for n_neighbors
n_neighbors = min(10, n_samples)

# Create a Nearest Neighbors model based on cosine similarity
nn_model = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine', algorithm='brute')
nn_model.fit(item_tfidf_matrix)

# %%
# Function to get item recommendations for a user
def get_recommend_projects_by_interests(user_id):
    user_profile = get_user_profile(user_id)
    
    # Find similar items based on user's interests
    item_indices = nn_model.kneighbors(user_profile, n_neighbors=n_neighbors)[1][0]
    
    # Filter out items that the user has already liked
    recommended_items = [items_data[idx]['_id'] for idx in item_indices if items_data[idx]['_id'] ]
    
    return recommended_items

# %%
def get_hybrid_recommendations(user_id, max=10):

    data1 = recommend_projects_by_user(user_id)
    data2 = get_recommend_projects_by_interests(user_id)

    recommend_ids = np.unique(np.concatenate((data1, data2)))

    # Get the liked items of the user
    liked_items = interactions_df[(interactions_df['userId'] == user_id)  & (interactions_df['status'] == 1)]['campaignId'].tolist()

    # Lấy thông tin chi tiết của các mục đề xuất sau khi loại bỏ các mục đã thích
    recommended_items = [
        item for item in items_data if item['_id'] in recommend_ids and item['_id'] not in liked_items
    ]

    return recommended_items

# %%
target_user_id = json.loads(lines[0].strip())
recommendations = get_hybrid_recommendations(target_user_id)
# Print recommended items
print(json.dumps(recommendations, ensure_ascii=False))



