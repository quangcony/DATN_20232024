import sys
import json
from remove_accents import remove_accents
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

lines = sys.stdin.readlines()
item_data = json.loads(lines[1].strip())

class ContentBasedRecommender:
    def __init__(self, item_data):
        self.item_data = item_data
        self.tfidf_vectorizer = TfidfVectorizer()
        self.item_content = []

    def fit(self):
        # Biểu diễn nội dung của các item bằng TF-IDF
        self.item_content = [remove_accents(item['title']) + ' ' + remove_accents(item['description']) + ' ' + remove_accents(item['content']) + ' ' + ((' ').join(item['tags'])) for item in self.item_data]
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.item_content)

    def recommend(self, input_text, top_n=15):
        # Biểu diễn chuỗi đầu vào bằng TF-IDF
        input_representation = ' '.join([input_text])

        # Tính độ tương tự cosine giữa input_text và các item content
        cosine_similarities = linear_kernel(self.tfidf_vectorizer.transform([input_representation]), self.tfidf_matrix).flatten()

        # Lấy danh sách các item có độ tương tự lớn hơn 0
        related_items_indices = [idx for idx, similarity in enumerate(cosine_similarities) if similarity > 0]

        # Sắp xếp các item theo độ tương tự giảm dần
        sorted_items = sorted(related_items_indices, key=lambda idx: cosine_similarities[idx], reverse=True)

        # Gợi ý top N item dựa trên độ tương tự
        top_n_items = [self.item_data[idx] for idx in sorted_items[:top_n]]
        return top_n_items

# Tạo một đối tượng ContentBasedRecommender và khởi tạo nó với dữ liệu item
recommender = ContentBasedRecommender(item_data)

# Huấn luyện mô hình
recommender.fit()

# Gợi ý dựa trên đầu vào
input_text = json.loads(lines[0].strip())
recommended_items = recommender.recommend((input_text), top_n=15)

# In ra kết quả

print(json.dumps(recommended_items, ensure_ascii=False))