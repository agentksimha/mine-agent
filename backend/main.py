import asyncio
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from agent import agent
from rss_feed import fetch_dgms_updates

app = FastAPI(title="Digital Mine Safety Officer")

# ---------------- CORS SETUP ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- QUERY ENDPOINT ----------------
@app.post("/query")
async def query_agent(request: Request):
    """
    Accepts {'query': 'your question'} and returns agent response.
    """
    data = await request.json()
    query = data.get("query", "")
    result = await asyncio.to_thread(agent.invoke, {"input": query})
    return {"response": result["output"]}


# ---------------- DGMS UPDATES ENDPOINT ----------------
@app.get("/updates")
async def get_dgms_updates():
    """
    Fetch DGMS updates and classify their danger level using the agent.
    """
    updates = fetch_dgms_updates(limit=5)

    async def analyze_update(item):
        title = item.get("title", "")
        link = item.get("link", "")
        published = item.get("published", "")

        # Try to fetch full article content for better analysis
        content = ""
        try:
            response = await asyncio.to_thread(requests.get, link, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")
            paragraphs = [p.get_text() for p in soup.find_all("p")]
            content = " ".join(paragraphs[:5]) if paragraphs else "(No text found.)"
        except Exception:
            content = "(Could not fetch full article text.)"

        # Construct safety classification prompt
        prompt = (
            f"You are a mining safety officer. Analyze the following DGMS update "
            f"and classify the risk level (High, Medium, Low, or None), and describe "
            f"the type of hazard if any (e.g., fire, collapse, explosion, gas leak, etc.).\n\n"
            f"Title: {title}\nPublished: {published}\nLink: {link}\n"
            f"Content: {content}"
        )

        try:
            result = await asyncio.to_thread(agent.invoke, {"input": prompt})
            output = result.get("output", "").strip()
        except Exception as e:
            output = f"⚠️ Error: {e}"

        return {
            "title": title,
            "link": link,
            "published": published,
            "danger_analysis": output,
        }

    # Run all analyses concurrently
    analyzed_updates = await asyncio.gather(*[analyze_update(u) for u in updates])
    return {"updates": analyzed_updates}


# ---------------- ROOT ENDPOINT ----------------
@app.get("/")
async def root():
    return {"message": "🦺 Digital Mine Safety Officer API is running!"}


