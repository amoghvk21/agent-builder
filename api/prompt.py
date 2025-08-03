from fastapi import FastAPI, HTTPException, Request
from langchain_openai import ChatOpenAI
import os
from fastapi.middleware.cors import CORSMiddleware


# Initialize the FastAPI app
app = FastAPI(
    title="CrewAI Sequential Agent API",
    description="An API to run a sequence of CrewAI agents.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/api/prompt/')
async def prompt(request: Request):

    try:
        # Get data
        body = await request.json()
        
        agents = body.get('agents', [])
        main_prompt = body.get('main_prompt', '')
        api_key = body.get('api_key', '')

        if not agents or agents == []:
            return {"error": "Agent list cannot be empty."}
        
        if not api_key or api_key == '':
            return {"error": "No API key provided."}
        
        # Initialise LLM
        os.environ["OPENAI_API_KEY"] = api_key
        llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

        current_context = main_prompt

        for agent_data in agents:
            # Create prompt
            prompt = f"""
            You are part of a sequential multi agent network. 
            Your role: {agent_data.get('system_prompt'), ''}
            Your context based on the previous agents before you: 
            ---
            {current_context}
            ---
            Your response should only contain your response rather than a summary of the intermediate steps. It should be in pain english. 
            """
            
            # Prompt llm
            response = llm.invoke(prompt)

            # output from this llm becomes context for the next one
            current_context = response.content
            print(current_context)
        
        return {"result": current_context}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))