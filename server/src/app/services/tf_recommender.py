# %%
import sys
import json
import numpy as np
import tensorflow as tf

lines = sys.stdin.readlines()

# get data
item_data = json.loads(lines[1].strip())
user_data = json.loads(lines[2].strip())

# %%
# Create mappings for user and item IDs
user_ids = [user["user_id"] for user in user_data]
item_ids = [item["item_id"] for item in item_data]

user_id_to_index = {user_id: index for index, user_id in enumerate(user_ids)}
item_id_to_index = {item_id: index for index, item_id in enumerate(item_ids)}

print(user_id_to_index)


# %%
# Create user-item matrix
num_users = len(user_ids)
num_items = len(item_ids)

user_item_matrix = np.zeros((num_users, num_items), dtype=np.float32)

# Fill in the user-item matrix with 1.0 for liked items
for user in user_data:
    user_index = user_id_to_index[user["user_id"]]
    for item_id in user["liked"]:
        item_index = item_id_to_index[item_id]
        user_item_matrix[user_index, item_index] = 1.0

print(user_item_matrix)

# %%
# Define the matrix factorization model
latent_dim = 10

# Define input layers for user and item IDs
user_input = tf.keras.layers.Input(shape=(1,))
item_input = tf.keras.layers.Input(shape=(1,))

# Create embeddings for users and items
user_embedding = tf.keras.layers.Embedding(num_users, latent_dim)(user_input)
item_embedding = tf.keras.layers.Embedding(num_items, latent_dim)(item_input)

# Create embeddings for user and item biases
user_bias = tf.keras.layers.Embedding(num_users, 1)(user_input)
item_bias = tf.keras.layers.Embedding(num_items, 1)(item_input)

# Calculate dot product of user and item embeddings
dot_product = tf.keras.layers.Dot(axes=2)([user_embedding, item_embedding])

# Add user and item biases to the dot product
dot_product = tf.keras.layers.Add()([dot_product, user_bias, item_bias])

# Create the recommendation model
model = tf.keras.Model(inputs=[user_input, item_input], outputs=dot_product)

print(user_input)

# %%
# Compile the model
model.compile(optimizer="adam", loss="mean_squared_error")

# %%
# Train the model
user_indices = [user_id_to_index[user["user_id"]] for user in user_data for _ in user["liked"]]
item_indices = [item_id_to_index[item_id] for user in user_data for item_id in user["liked"]]
ratings = [1.0] * len(user_indices)

history = model.fit(
    [np.array(user_indices), np.array(item_indices)],
    np.array(ratings),
    epochs=50,
    verbose=1,
    validation_split=0.2
)

print(user_indices)


# %%
print(model.summary())

# %%
# Make recommendations for a specific user (e.g., user_id = 1)
user_id_to_recommend = 1
user_index_to_recommend = user_id_to_index[user_id_to_recommend]
user_embedding_weights = model.layers[2].get_weights()[0]
# Access item embedding weights
item_embedding_weights = model.layers[3].get_weights()[0]

# # Get the top N recommended items

top_n = 5
# # Calculate the number of items
num_items = len(item_ids)

# # Ensure top_n does not exceed the number of items
top_n = min(top_n, num_items)

# Calculate predicted ratings for all items for the user
user_ratings = np.dot(user_embedding_weights[user_index_to_recommend], item_embedding_weights.T)

# Get the indices of items sorted by user ratings in descending order
sorted_item_indices = np.argsort(user_ratings)[::-1]

# Create a set of items that the user has liked for efficient lookup
liked_items = set(user_data[user_index_to_recommend]["liked"])

# Debug print to check liked_items
print("Liked Items:", liked_items)
# Filter out items that the user has already liked
recommended_item_indices = [item_ids[i] for i in sorted_item_indices if item_ids[i] not in liked_items][:top_n]

# recommended_item_indices = [i for i in sorted_item_indices if item_ids[i] not in liked_items][:top_n]

# Retrieve the actual item data for the recommended items
recommended_items_data = [item for item in item_data if item["item_id"] in recommended_item_indices]

print(f"Top {top_n} recommended items for user {user_id_to_recommend}:")
print(recommended_items_data)

# Get the corresponding item IDs for the top N recommended items
# recommended_item_ids = [i for i in top_item_indices ]




