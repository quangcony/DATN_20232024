from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Dữ liệu sản phẩm với mô tả và nội dung có liên quan
item_data = [
    {
        "item_id": "it1",
        "title": "Healthy Food Campaign",
        "genres": ["health", "food"],
        "tags": ["support", "backer", "campaign", "việt nam"],
        "description": "A campaign for healthy food support.",
        "content": "Join us to back this campaign for healthy food."
    },
    {
        "item_id": "it2",
        "title": "Creative Film and Technology",
        "genres": ["film", "technology"],
        "tags": ["support", "backer", "community"],
        "description": "Support creative film and technology projects.",
        "content": "Join the community of backers to fund innovative film and technology endeavors."
    },
    {
        "item_id": "it3",
        "title": "Innovative Technology Campaign",
        "genres": ["technology"],
        "tags": ["campaign", "creative"],
        "description": "An innovative technology campaign.",
        "content": "Support this campaign to promote creative technology solutions."
    },
    {
        "item_id": "it4",
        "title": "Food and Health Support",
        "genres": ["food", "health"],
        "tags": ["support", "backer", "community"],
        "description": "Community support for food and health initiatives.",
        "content": "Join our community to support creative food and health projects."
    },
    {
        "item_id": "it5",
        "title": "Music and Art Creative Campaign",
        "genres": ["music", "art"],
        "tags": ["campaign", "community", "creative"],
        "description": "A creative campaign in the world of music and art.",
        "content": "Join our creative community to back music and art projects."
    },
    {
        "item_id": "it6",
        "title": "Health and Film Support Campaign",
        "genres": ["film", "health"],
        "tags": ["support", "backer", "campaign"],
        "description": "Campaign for health and film support.",
        "content": "Support this campaign to promote healthy living and creative film projects."
    },
    {
        "item_id": "it7",
        "title": "Tech and Music Initiatives",
        "genres": ["technology", "music"],
        "tags": ["backer", "community", "creative"],
        "description": "Support innovative technology and music endeavors.",
        "content": "Join our creative community to back technology and music projects."
    },
    {
        "item_id": "it8",
        "title": "Delicious Food Crowdfunding",
        "genres": ["food"],
        "tags": ["backer", "crowdfunding"],
        "description": "A crowdfunding project for food lovers.",
        "content": "Back this project and help fund the development of delicious food products."
    },
    {
        "item_id": "it9",
        "title": "Creative Film Support",
        "genres": ["film"],
        "tags": ["support", "backer", "community"],
        "description": "Support creative film projects.",
        "content": "Join the community of backers to fund innovative film endeavors."
    },
    {
        "item_id": "it10",
        "title": "Healthy Food Creative Campaign",
        "genres": ["health", "food"],
        "tags": ["campaign", "community", "creative"],
        "description": "Creative campaigns for healthy food choices.",
        "content": "Join our creative community to back healthy food initiatives."
    },
    {
        "item_id": "it11",
        "title": "Music Crowdfunding",
        "genres": ["music"],
        "tags": ["backer", "crowdfunding"],
        "description": "Back music projects you love.",
        "content": "Contribute to crowdfunding efforts for your favorite music artists."
    },
    {
        "item_id": "it12",
        "title": "Supporting the Arts",
        "genres": ["art"],
        "tags": ["support", "backer", "community"],
        "description": "Support the art world and creative endeavors.",
        "content": "Join the community of backers to fund innovative art projects."
    },
    {
        "item_id": "it13",
        "title": "Innovative Tech and Food",
        "genres": ["technology", "food"],
        "tags": ["backer", "community", "creative"],
        "description": "Innovative tech and food projects.",
        "content": "Join our creative community to back technology and food initiatives."
    },
    {
        "item_id": "it14",
        "title": "Creative Film and Music",
        "genres": ["film", "music"],
        "tags": ["support", "backer", "campaign"],
        "description": "Support creative film and music projects.",
        "content": "Join us to back this campaign for innovative film and music projects."
    },
    {
        "item_id": "it15",
        "title": "Health and Technology Initiatives",
        "genres": ["health", "technology"],
        "tags": ["backer", "community", "creative"],
        "description": "Back creative health and tech initiatives.",
        "content": "Join our community to support innovative health and technology projects."
    },
    {
        "item_id": "it16",
        "title": "Food and Art Creative Campaign",
        "genres": ["food", "art"],
        "tags": ["campaign", "community", "creative"],
        "description": "Creative campaigns for food and art lovers.",
        "content": "Join our creative community to back food and art initiatives."
    },
    {
        "item_id": "it17",
        "title": "Healthy Film Crowdfunding",
        "genres": ["film", "health"],
        "tags": ["backer", "crowdfunding"],
        "description": "Crowdfunding for healthy film projects.",
        "content": "Contribute to crowdfunding efforts for creative and healthy film projects."
    },
    {
        "item_id": "it18",
        "title": "Music and Tech Campaigns",
        "genres": ["music", "technology"],
        "tags": ["campaign", "community", "creative"],
        "description": "Campaigns for innovative music and tech projects.",
        "content": "Join our creative community to back music and technology initiatives."
    },
    {
        "item_id": "it19",
        "title": "Supporting Creative Food",
        "genres": ["food", "health"],
        "tags": ["support", "backer", "campaign"],
        "description": "Support creative food and health projects.",
        "content": "Join us to back this campaign for delicious food and healthy living."
    },
    {
        "item_id": "it20",
        "title": "Music and Art Crowdfunding",
        "genres": ["music", "art"],
        "tags": ["backer", "crowdfunding"],
        "description": "Support music and art projects you love.",
        "content": "Contribute to crowdfunding efforts for creative music and art endeavors."
    },
    {
        "item_id": "it21",
        "title": "Tech and Music Campaign",
        "genres": ["technology", "music"],
        "tags": ["support", "backer", "campaign"],
        "description": "Support innovative tech and music projects.",
        "content": "Join us to back this campaign for creative technology and music initiatives."
    },
    {
        "item_id": "it22",
        "title": "Creative Food and Art",
        "genres": ["food", "art"],
        "tags": ["backer", "community", "creative"],
        "description": "Back creative food and art projects.",
        "content": "Contribute to creative projects in the world of food and art."
    },
    {
        "item_id": "it23",
        "title": "Healthy Film Campaign",
        "genres": ["film", "health"],
        "tags": ["campaign", "community", "creative"],
        "description": "Campaigns for healthy living and creative film projects.",
        "content": "Join our creative community to back health and film initiatives."
    },
    {
        "item_id": "it24",
        "title": "Music and Tech Support",
        "genres": ["music", "technology"],
        "tags": ["support", "backer", "campaign"],
        "description": "Support music and tech projects.",
        "content": "Join us to back this campaign for innovative music and technology projects."
    },
    {
        "item_id": "it25",
        "title": "Creative Food Crowdfunding",
        "genres": ["food", "health"],
        "tags": ["backer", "crowdfunding"],
        "description": "Crowdfunding for creative food and health projects.",
        "content": "Contribute to crowdfunding efforts for creative and healthy food projects."
    },
    {
        "item_id": "it26",
        "title": "Creative Film and Art",
        "genres": ["film", "art"],
        "tags": ["campaign", "community", "creative"],
        "description": "Creative campaigns for film and art lovers.",
        "content": "Join our creative community to back film and art initiatives."
    },
    {
        "item_id": "it27",
        "title": "Tech and Music Creative Projects",
        "genres": ["technology", "music"],
        "tags": ["support", "backer", "community"],
        "description": "Support tech and music projects you love.",
        "content": "Contribute to creative projects in the world of technology and music."
    },
    {
        "item_id": "it28",
        "title": "Healthy Food and Living Campaigns",
        "genres": ["food", "health"],
        "tags": ["campaign", "community", "creative"],
        "description": "Campaigns for healthy food and living.",
        "content": "Join our creative community to back initiatives for delicious food and healthy living."
    },
    {
        "item_id": "it29",
        "title": "Creative Music and Art Crowdfunding",
        "genres": ["music", "art"],
        "tags": ["backer", "crowdfunding"],
        "description": "Back creative music and art projects.",
        "content": "Contribute to crowdfunding efforts for creative music and art endeavors."
    },
    {
        "item_id": "it30",
        "title": "Film and Tech Innovation",
        "genres": ["film", "technology"],
        "tags": ["support", "backer", "campaign"],
        "description": "Support film and technology projects you love.",
        "content": "Contribute to creative projects in the world of film and technology."
    }
]

from remove_accents import remove_accents

class ContentBasedRecommender:
    def __init__(self, item_data):
        self.item_data = item_data
        self.tfidf_vectorizer = TfidfVectorizer()
        self.item_content = []

    def fit(self):

        # Biểu diễn nội dung của các item bằng TF-IDF
        self.item_content = [item['title'] + ' ' + item['description'] + ' ' + item['content'] + ' ' + remove_accents((' ').join(item['tags'])) for item in self.item_data]
        print("self.item_content::", self.item_content)
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.item_content)

    def recommend(self, input_text, top_n=5):
        # Biểu diễn chuỗi đầu vào bằng TF-IDF
        input_representation = ' '.join([input_text])

        # Tính độ tương tự cosine giữa input_text và các item content
        cosine_similarities = linear_kernel(self.tfidf_vectorizer.transform([input_representation]), self.tfidf_matrix).flatten()

        # Lấy danh sách các item có độ tương tự lớn hơn hoặc bằng 0.4
        related_items_indices = [idx for idx, similarity in enumerate(cosine_similarities) if similarity >= 0.4]

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
input_text = "Support healthy"
recommended_items = recommender.recommend(input_text, top_n=5)

# In ra kết quả

print(recommended_items)