import sys
import json
from remove_accents import remove_accents
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

lines = sys.stdin.readlines()
item_data = json.loads(lines[1].strip())

# Tạo DataFrame từ dữ liệu
df = pd.DataFrame(item_data)

# Chuyển đổi danh sách thành chuỗi trước khi kết hợp
df['genres'] = df['genres'].apply(lambda x: ' '.join(x))
df['tags'] = df['tags'].apply(lambda x: ' '.join(x))

# Kết hợp các trường genres, tags, description và content thành một trường mô tả
df['combine_data'] = df['genres'] + ' ' + df['tags'] + ' ' + df['description'] + ' ' + df['title']

# Sử dụng TF-IDF để biểu diễn dữ liệu văn bản
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combine_data'])

# Sử dụng cosine similarity để tìm các mục giống nhau
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Hàm để đề xuất các mục dựa trên một mục đầu vào và trả lại dưới dạng danh sách
def get_recommendations(item_id, cosine_sim=cosine_sim):
    idx = df.index[df['_id'] == item_id].tolist()[0]
    filter_scores = []

    sim_scores = list(enumerate(cosine_sim[idx]))

    for score in sim_scores:
        if score[1] > 0:
            filter_scores.append(score)

    filter_scores = sorted(filter_scores, key=lambda x: x[1], reverse=True)
    filter_scores = filter_scores[1:11]  # Lấy 10 mục tương tự (loại bỏ mục hiện tại)
    item_indices = [i[0] for i in filter_scores]

    item_ids = df['_id'].iloc[item_indices].tolist()
    # Sử dụng list comprehension để tìm các đối tượng tương ứng
    items = [item for item in item_data if item['_id'] in item_ids]
    return items

item_id = json.loads(lines[0].strip())
# Sử dụng hàm để đưa ra đề xuất
recommendations = get_recommendations(item_id)
# print(recommendations)
print(json.dumps(recommendations, ensure_ascii=False))
