import requests
from bs4 import BeautifulSoup
from datetime import datetime

DGMS_RSS_URL = "https://www.mining.com/feed/"  # Replace with correct feed if needed

def fetch_dgms_updates(limit: int = 5):
    """
    Fetch recent updates from DGMS RSS feed using requests + BeautifulSoup.
    Returns a list of {title, link, published} dicts.
    """
    try:
        response = requests.get(DGMS_RSS_URL, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "xml")
        items = soup.find_all("item")

        updates = []
        for item in items[:limit]:
            title = item.title.text if item.title else "Untitled"
            link = item.link.text if item.link else ""
            pub_date = item.pubDate.text if item.pubDate else "Unknown Date"

            # Optional: format date for readability
            try:
                pub_date = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d")
            except Exception:
                pass

            updates.append({
                "title": title.strip(),
                "link": link.strip(),
                "published": pub_date
            })

        if not updates:
            updates = [{"title": "No updates found", "link": "", "published": ""}]

        return updates

    except Exception as e:
        print("⚠️ Error fetching DGMS RSS feed:", e)
        return [{"title": "Error fetching DGMS feed", "link": "", "published": ""}]


