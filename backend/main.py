from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .agent import agent

app = FastAPI(title="Digital Mine Safety Officer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query_agent(request: Request):
    data = await request.json()
    query = data.get("query", "")
    response = agent.run(query)
    return {"response": response}
