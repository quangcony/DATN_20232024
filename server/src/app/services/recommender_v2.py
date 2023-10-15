import pandas as pd
import json
import random
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Load dữ liệu từ JSON
# Load user interests from JSON (replace 'your_interests.json' with your JSON file)
with open('D:/Workspace/DATN_2023/server/src/app/data/users_v2.json', 'r', encoding='utf-8') as json_file:
    user_data = json.load(json_file)

# Load item data from JSON (replace 'your_items.json' with your JSON file)
with open('D:/Workspace/DATN_2023/server/src/app/data/items.json', 'r', encoding='utf-8') as json_file:
    items_data = json.load(json_file)

# Tạo danh sách các genres và tags phổ biến trong lĩnh vực crowdfunding
# genres = ["technology", "innovation", "art", "design", "music", "film", "fashion", "food", "gaming", "health"]
# tags = ["kickstarter", "crowdfunding", "fundraising", "backer", "campaign", "support", "project", "creative", "community", "donation"]

# Chuyển dữ liệu thành DataFrame
items_df = pd.DataFrame(items_data)
users_df = pd.DataFrame(user_data)

# Collaborative Filtering (User-Based CF)
def user_based_cf(user_id, num_items=10, users_df=users_df):
    liked_items = users_df[users_df['user_id'] == user_id]['liked'].values[0]
    similar_users = users_df[users_df['user_id'] != user_id]
    recommendations = []
    similar_users_list = []  # Danh sách người dùng tương đồng
    
    for idx, row in similar_users.iterrows():
        common_liked_items = set(liked_items).intersection(set(row['liked']))
        if len(common_liked_items) > 0:
            # Tính toán độ tương đồng cosine giữa người dùng
            user_vector = np.array([1 if item in liked_items else 0 for item in items_df['item_id']])
            row_vector = np.array([1 if item in row['liked'] else 0 for item in items_df['item_id']])
            similarity = np.dot(user_vector, row_vector) / (np.linalg.norm(user_vector) * np.linalg.norm(row_vector))
            
            # Nếu có độ tương đồng đủ lớn, thêm các mục của người dùng này vào danh sách khuyến nghị
            if similarity >= 0.5:
                recommendations.extend(row['liked'])
                similar_users_list.append(row['user_id'])
    
    # In ra những người dùng tương đồng nếu có
    if similar_users_list:
        print(f"Users similar to user {user_id}: {', '.join(similar_users_list)}")
    
    # Lọc bớt các item đã được người dùng thích
    recommendations = list(set(recommendations) - set(liked_items))
    
    # Chọn num_items items từ danh sách đã xáo trộn
    recommended_items = recommendations[:num_items]
    
    return recommended_items

# # Collaborative Filtering (User-Based CF)
# def user_based_cf(user_id):
#     liked_items = users_df[users_df['user_id'] == user_id]['liked'].values[0]
#     similar_users = users_df[users_df['user_id'] != user_id]
#     recommendations = []
#     similar_users_list = []  # Danh sách người dùng tương đồng
    
#     for idx, row in similar_users.iterrows():
#         common_liked_items = set(liked_items).intersection(set(row['liked']))
#         if len(common_liked_items) > 0:
#             # Tính toán độ tương đồng cosine giữa người dùng
#             user_vector = np.array([1 if item in liked_items else 0 for item in items_df['item_id']])
#             row_vector = np.array([1 if item in row['liked'] else 0 for item in items_df['item_id']])
#             similarity = np.dot(user_vector, row_vector) / (np.linalg.norm(user_vector) * np.linalg.norm(row_vector))
            
#             # Nếu có độ tương đồng đủ lớn, thêm các mục của người dùng này vào danh sách khuyến nghị
#             if similarity >= 0.5:
#                 recommendations.extend(row['liked'])
#                 similar_users_list.append(row['user_id'])
    
#     # In ra những người dùng tương đồng nếu có
#     if similar_users_list:
#         print(f"Users similar to user {user_id}: {', '.join(similar_users_list)}")

#     # Lọc bớt các item đã được người dùng thích
#     recommendations = list(set(recommendations) - set(liked_items))
    
#     # Xáo trộn danh sách khuyến nghị
#     random.shuffle(recommendations)
    
#     # Chọn num_items items từ danh sách đã xáo trộn
#     recommended_items = recommendations[:5]
#     print('recommended_items: ', recommended_items)
    
#     return recommended_items

# Content-Based Filtering (CBF)
def content_based_cf(user_id):
    user_interests = users_df[users_df['user_id'] == user_id]['interests'].values[0]
    
    # Kết hợp genres và tags thành một danh sách duy nhất
    item_features = items_df['genres'] + items_df['tags']
    
    # Chuyển danh sách thành chuỗi (string) duy nhất
    item_features = item_features.apply(lambda x: ' '.join(x))
    
    tfidf_vectorizer = TfidfVectorizer()
    item_features_tfidf = tfidf_vectorizer.fit_transform(item_features)
    user_interests_tfidf = tfidf_vectorizer.transform([' '.join(user_interests)])
    
    # Tính toán độ tương tự dựa trên thước đo cosine similarity
    similarity = cosine_similarity(user_interests_tfidf, item_features_tfidf)
    
    # Lấy các mục có độ tương tự cao nhất
    recommendations = items_df.iloc[similarity.argsort()[0]][::-1]

    return recommendations['item_id'].tolist()

# Hệ thống khuyến nghị hybrid
def hybrid_recommendations(user_id):
    user_cf_recommendations = user_based_cf(user_id)
    user_cbf_recommendations = content_based_cf(user_id)
    
    # Kết hợp các khuyến nghị từ CF và CBF (ví dụ: lấy 5 mục từ mỗi loại)
    hybrid_recommendations = user_cf_recommendations[:5] + user_cbf_recommendations[:5]

    num_items = min(5, len(hybrid_recommendations))

    # Xáo trộn danh sách khuyến nghị
    random.shuffle(hybrid_recommendations)

    # top 5 recommend items
    recommended_items = hybrid_recommendations[:num_items]
    
    return recommended_items

# Test hệ thống khuyến nghị
user_id = "u1"
recommendations = hybrid_recommendations(user_id)
print("Recommended items for user {}: {}".format(user_id, recommendations))
# print(recommendations)
