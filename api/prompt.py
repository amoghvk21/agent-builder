from fastapi import FastAPI, HTTPException
from langchain_openai import ChatOpenAI
import os


# Initialize the FastAPI app
app = FastAPI(
    title="CrewAI Sequential Agent API",
    description="An API to run a sequence of CrewAI agents.",
)

@app.post('/prompt/')
async def prompt(request):

    try:
        # Get data
        body = await request.json()

        agents = body.get('agents', [])
        main_prompt = body.get('main_prompt', '')
        api_key = body.get('api_key', '')
        
        if not agents:
            return {"error": "Agent list cannot be empty."}

        if not api_key:
            return {"error": "No API key provided."}
        
        # Initialise LLM
        os.environ["OPENAI_API_KEY"] = api_key
        llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

        current_context = request.main_prompt
        final_result = ""

        for i, agent_data in enumerate(agents):
            # Create prompt
            prompt = f"""
            You are part of a sequential multi agent network. 
            Your role: {agent_data.get('system_prompt'), ''}
            Your context based on the previous agents before you: 
            ---
            {current_context}
            ---
            """

            # Prompt llm
            response = llm.invoke(prompt)
            
            # output from this llm becomes context for the next one
            current_context = response
        
        return {"result": current_context}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))