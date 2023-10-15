import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans

# Provided data
genres = [
    {
        "genre_id": 'g1',
        "genre_name": "action",
    },
    {
        "genre_id": 'g2',
        "genre_name": "adventure",
    },
    {
        "genre_id": 'g3',
        "genre_name": "comedy",
    },
    {
        "genre_id": 'g4',
        "genre_name": "romance",
    },
    {
        "genre_id": 'g5',
        "genre_name": "science fiction",
    },
    {
        "genre_id": 'g6',
        "genre_name": "education",
    },
    {
        "genre_id": 'g7',
        "genre_name": "technology",
    },
    {
        "genre_id": 'g8',
        "genre_name": "artificial intelligence",
    },
    {
        "genre_id": 'g9',
        "genre_name": "health care",
    },
]

item_data = [
    {
        "item_id": 'it1',
        "item_genres": ['g7'],
        "tags": ['Web 3'],
        "description": "Experience the thrill of action and adventure in a futuristic world. Dive into the world of Web 3 technology. (New version)"
    },
    {
        "item_id": 'it2',
        "item_genres": ['g7', 'g8'],
        "tags": ['NFT', 'Blockchain'],
        "description": "Explore the fascinating realm of NFTs and blockchain technology. Discover the mathematical foundations behind it all. (Updated)"
    },
    {
        "item_id": 'it3',
        "item_genres": ['g9'],
        "tags": ['covid19', 'virus'],
        "description": "Learn about the mathematical modeling of epidemics and the spread of viruses like COVID-19. (Revised)"
    },
    {
        "item_id": 'it4',
        "item_genres": ['g8'],
        "tags": ['Machine Learning'],
        "description": "Dive deep into the mathematical algorithms that power machine learning and artificial intelligence. (Enhanced)"
    },
    {
        "item_id": 'it5',
        "item_genres": ['g8'],
        "tags": ['Tensorflow'],
        "description": "Discover the mathematical foundations of deep learning with TensorFlow, a powerful AI framework. (Revised)"
    },
    {
        "item_id": 'it6',
        "item_genres": ['g8'],
        "tags": ['Deep learning'],
        "description": "Explore the mathematical principles underlying deep learning, a key technology in AI and education. (Updated)"
    },
    {
        "item_id": 'it7',
        "item_genres": ['g9', 'g6'],
        "tags": ['Đà nẵng', 'covid19'],
        "description": "Study the mathematical aspects of epidemics and their impact on local communities, like Đà nẵng. (Revised)"
    },
    {
        "item_id": 'it8',
        "item_genres": ['g7'],
        "tags": ['Lighting'],
        "description": "Uncover the mathematical concepts behind modern lighting and illumination technologies. (New version)"
    },
    {
        "item_id": 'it9',
        "item_genres": ['g8'],
        "tags": ['Chain', 'Blockchain'],
        "description": "Delve into the mathematical foundations of blockchain and distributed ledger technologies. (Enhanced)"
    },
    {
        "item_id": 'it10',
        "item_genres": ['g8'],
        "tags": ['Blockchain'],
        "description": "(Enhanced)"
    },
    {
        "item_id": 'it11',
        "item_genres": ['g8'],
        "tags": ['Blockchain'],
        "description": "(Enhanced)"
    },
    {
        "item_id": 'it12',
        "item_genres": ['g8'],
        "tags": ['Blockchain'],
        "description": "(Enhanced)"
    },
    {
        "item_id": 'it13',
        "item_genres": ['g8'],
        "tags": ['Blockchain'],
        "description": "(Enhanced)"
    },
    {
        "item_id": 'it14',
        "item_genres": ['g8', 'g7'],
        "tags": ['Blockchain', 'NFT'],
        "description": "(Enhanced)"
    }
]



user_data = [
    {
        "user_id": 'a1',
        "interests_genre": ['g7', 'g8'],
        "liked": ['it2', 'it4']
    },
    {
        "user_id": 'a2',
        "interests_genre": ['g3', 'g4'],
        "liked": ['it1']
    }
]

# Step 1: Feature Engineering

# Create a mapping from genre_id to index
genre_to_index = {genre['genre_id']: idx for idx, genre in enumerate(genres)}

# Create a mapping from item_id to index
item_to_index = {item['item_id']: idx for idx, item in enumerate(item_data)}

# Create a mapping from user_id to index
user_to_index = {user['user_id']: idx for idx, user in enumerate(user_data)}

# Step 2: Text Processing

# Extract tags and description from item_data
item_tags = [item['tags'] for item in item_data]
item_descriptions = [item['description'] for item in item_data]

# Convert item tags and description to a space-separated string
item_tags_text = [' '.join(tags) for tags in item_tags]
item_descriptions_text = [' '.join(description.split()) for description in item_descriptions]

# Combine tags and descriptions for TF-IDF vectorization
item_text = [tags + ' ' + description for tags, description in zip(item_tags_text, item_descriptions_text)]

# Use TF-IDF Vectorizer to convert text to numerical features
tfidf_vectorizer = TfidfVectorizer()
item_text_matrix = tfidf_vectorizer.fit_transform(item_text)

# Step 3: Calculate Item Profiles
# Initialize user_profiles and item_profiles with the same number of columns
num_columns = len(genres) + tfidf_vectorizer.get_feature_names_out().shape[0]

# item_profiles = np.zeros((len(item_data), len(genres)))
item_profiles = np.zeros((len(item_data), num_columns))

# Populate item profiles based on genres
for item in item_data:
    for genre_id in item['item_genres']:
        genre_index = genre_to_index[genre_id]
        item_index = item_to_index[item['item_id']]
        item_profiles[item_index, genre_index] = 1.0

# Add TF-IDF features from item descriptions to item profiles
item_profiles[:, len(genres):] = item_text_matrix.toarray()

# Step 4: Calculate User Profiles

# user_profiles = np.zeros((len(user_data), len(genres)))
user_profiles = np.zeros((len(user_data),  num_columns))

# Populate user profiles based on liked items
for user in user_data:
    user_index = user_to_index[user['user_id']]
    for liked_item_id in user['liked']:
        liked_item_index = item_to_index[liked_item_id]
        user_profiles[user_index, :] += item_profiles[liked_item_index, :]

# Step 5: Content Clustering

# Use K-Means clustering on item profiles
num_clusters = 3  # You can adjust the number of clusters as needed
kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
item_clusters = kmeans.fit_predict(item_profiles)

# Step 6: Recommendation with Content Clustering

# Recommend items for each user based on cosine similarity and diversity
recommendations = {}
for user in user_data:
    user_index = user_to_index[user['user_id']]
    user_profile = user_profiles[user_index, :]

    # Calculate cosine similarities between user profile and item profiles
    similarities = cosine_similarity([user_profile], item_profiles)

    # Get the indices of items sorted by similarity (descending order)
    item_indices = np.argsort(similarities[0])[::-1]

    # Exclude items that the user has already liked
    recommended_items = []

    # Create a dictionary to count the number of recommended items from each cluster
    cluster_counts = {cluster_id: 0 for cluster_id in range(num_clusters)}

    for i in item_indices:
        item_id = item_data[i]['item_id']
        cluster_id = item_clusters[i]

        # Ensure diversity by selecting items from different clusters
        if cluster_counts[cluster_id] < 2:  # Limit to 2 items per cluster
            recommended_items.append(item_id)
            cluster_counts[cluster_id] += 1

        if len(recommended_items) >= 5:  # Limit the total number of recommendations
            break

    recommendations[user['user_id']] = recommended_items

# Print recommendations for each user
for user_id, recommended_items in recommendations.items():
    print(f"User {user_id} should check out these items: {recommended_items}")
