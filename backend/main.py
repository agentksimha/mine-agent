import asyncio
import io
import os
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
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
    Returns JSON (title, link, date, and analysis).
    """
    updates = fetch_dgms_updates(limit=5)

    async def analyze_update(item):
        title = item.get("title", "")
        link = item.get("link", "")
        published = item.get("published", "")

        # Try to fetch full article content for better analysis
        try:
            response = await asyncio.to_thread(requests.get, link, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")
            paragraphs = [p.get_text() for p in soup.find_all("p")]
            content = " ".join(paragraphs[:5]) if paragraphs else "(No text found.)"
        except Exception:
            content = "(Could not fetch full article text.)"

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

    analyzed_updates = await asyncio.gather(*[analyze_update(u) for u in updates])
    return {"updates": analyzed_updates}


# ---------------- AUDIT REPORT PDF ENDPOINT ----------------
@app.post("/audit_report_pdf")
async def generate_audit_report_pdf(request: Request):
    """
    Generates an AI-driven mining safety audit report and returns it as a downloadable PDF.
    """
    data = await request.json()
    state = data.get("state", "All States")
    year = data.get("year", "All Years")
    hazard_type = data.get("hazard_type", "All Hazards")

    prompt = (
        f"You are a mining safety audit assistant. Using the DGMS mining accident data, "
        f"generate a detailed safety audit report for:\n\n"
        f"State: {state}\nYear: {year}\nHazard Type: {hazard_type}\n\n"
        f"Provide insights on:\n"
        f"- Total number of reported incidents\n"
        f"- Distribution of accidents by category (gas leak, collapse, fire, machinery, etc.)\n"
        f"- Severity levels (High / Medium / Low)\n"
        f"- Common root causes\n"
        f"- Recommendations to improve safety\n"
        f"- Year-over-year or state-wise trend if applicable\n\n"
        f"Return your answer as a structured JSON with these keys: "
        f"'summary', 'statistics', 'recommendations', and 'trend_analysis'."
    )

    try:
        result = await asyncio.to_thread(agent.invoke, {"input": prompt})
        output = result.get("output", "").strip()
    except Exception as e:
        output = json.dumps({"summary": f"⚠️ Error generating report: {e}"}, indent=2)

    # Attempt to parse JSON response
    try:
        report_data = json.loads(output)
    except json.JSONDecodeError:
        report_data = {"summary": output}

    # ---------------- Create PDF ----------------
    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "🦺 Mining Safety Audit Report")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"State: {state}")
    c.drawString(50, height - 100, f"Year: {year}")
    c.drawString(50, height - 120, f"Hazard Type: {hazard_type}")

    c.setFont("Helvetica-Bold", 14)
    y = height - 160
    for section, text in report_data.items():
        c.drawString(50, y, section.capitalize())
        y -= 20
        c.setFont("Helvetica", 11)

        for line in str(text).splitlines():
            while len(line) > 90:
                part = line[:90]
                c.drawString(60, y, part)
                y -= 15
                line = line[90:]
            c.drawString(60, y, line)
            y -= 15
            if y < 100:
                c.showPage()
                y = height - 100
                c.setFont("Helvetica", 11)
        y -= 20
        c.setFont("Helvetica-Bold", 14)

    c.save()
    pdf_buffer.seek(0)

    filename = f"Audit_Report_{state}_{year}.pdf"
    with open(filename, "wb") as f:
        f.write(pdf_buffer.getvalue())

    # Return file as downloadable response
    return FileResponse(
        path=filename,
        filename=filename,
        media_type="application/pdf"
    )


# ---------------- ROOT ENDPOINT ----------------
@app.get("/")
async def root():
    return {"message": "🦺 Digital Mine Safety Officer API is running!"}



