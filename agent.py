from langchain.agents import initialize_agent, Tool
from langchain_community.chat_models import ChatOllama
from langchain.chains import ConversationalRetrievalChain
from .retriever import get_vectorstore
from .rules_engine import evaluate_rules

# Local model
llm = ChatOllama(model="mistral")

# Retriever (RAG)
retriever = get_vectorstore()
qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever)

# Define tools
def query_knowledge(query: str):
    return qa_chain.run(query)

def run_rules_engine(input_text: str):
    # mock parse input
    if "methane" in input_text.lower():
        data = {"methane_ppm": 6000}
    else:
        data = {"incidents": 1, "methane_ppm": 1000}
    return evaluate_rules(data)

tools = [
    Tool(name="KnowledgeQuery", func=query_knowledge, description="Answer factual or data-driven questions."),
    Tool(name="SafetyRules", func=run_rules_engine, description="Evaluate mine safety or compliance conditions."),
]

# Agent setup
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type="chat-conversational-react-description",
    verbose=True
)
