import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

item_data = [
    {
        "item_id": "it1",
        "title": "Healthy Food Campaign",
        "genres": ["health", "food"],
        "tags": ["support", "backer", "campaign"],
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



# Tạo DataFrame từ dữ liệu
df = pd.DataFrame(item_data)

# Chuyển đổi danh sách thành chuỗi trước khi kết hợp
df['genres'] = df['genres'].apply(lambda x: ' '.join(x))
df['tags'] = df['tags'].apply(lambda x: ' '.join(x))

# Kết hợp các trường genres, tags, description và content thành một trường mô tả
df['combine_data'] = df['genres'] + ' ' + df['tags'] + ' ' + df['description'] + ' ' + df['content']

# Sử dụng TF-IDF để biểu diễn dữ liệu văn bản
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combine_data'])

# Sử dụng cosine similarity để tìm các mục giống nhau
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Hàm để đề xuất các mục dựa trên một mục đầu vào và trả lại dưới dạng danh sách
def get_recommendations(item_id, cosine_sim=cosine_sim):
    idx = df.index[df['item_id'] == item_id].tolist()[0]
    filter_scores = []
    sim_scores = list(enumerate(cosine_sim[idx]))

    for score in sim_scores:
        if score[1] > 0.2:
            filter_scores.append(score)

    filter_scores = sorted(filter_scores, key=lambda x: x[1], reverse=True)

    filter_scores = filter_scores[1:11]  # Lấy 10 mục tương tự (loại bỏ mục hiện tại)

    item_indices = [i[0] for i in filter_scores]

    item_ids = df['item_id'].iloc[item_indices].tolist()

    # Sử dụng list comprehension để tìm các đối tượng tương ứng
    items = [item for item in item_data if item['item_id'] in item_ids]

    return item_ids

# Sử dụng hàm để đưa ra đề xuất
recommendations = get_recommendations("it1")
print(recommendations)
