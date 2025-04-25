import requests
from bs4 import BeautifulSoup

# url = 'https://news.naver.com/breakingnews/section/105/732'
# headers = {
#     'User-Agent': 'Mozilla/5.0'
# }

# res = requests.get(url, headers=headers)
# soup = BeautifulSoup(res.text, 'html.parser')

# # 기사 제목 출력
# for a_tag in soup.select('a'):
#     if a_tag.get('href') and 'article' in a_tag.get('href'):
#         title = a_tag.get_text(strip=True)
#         link = a_tag['href']
#         if title:  # 빈 문자열 제외
#             print(title, link)

headers = {
    'User-Agent': 'Mozilla/5.0'
}
url = 'https://news.ycombinator.com/'
res = requests.get(url, headers=headers)
soup = BeautifulSoup(res.text, 'html.parser')

for a in soup.select('.titleline > a'):
    print(a.text, a['href'])
