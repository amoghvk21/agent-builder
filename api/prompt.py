from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from crewai import Agent, Task, Crew, Process
import os


# Initialize the FastAPI app
app = FastAPI(
    title="CrewAI Sequential Agent API",
    description="An API to run a sequence of CrewAI agents.",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/prompt/")
async def run_sequential_crew(request: Request):
    """
    This endpoint takes a list of agents and a main prompt,
    creates a sequential crew, runs the process, and returns the final result.
    """
    # Parse the JSON body
    body = await request.json()
    
    agents = body.get('agents', [])
    main_prompt = body.get('main_prompt', '')
    api_key = body.get('api_key', '')
    
    if not agents:
        return {"error": "Agent list cannot be empty."}

    if not api_key:
        return {"error": "No API key provided."}

    # --- 1. Initialise the LLM ---
    # Set the API key as environment variable for CrewAI
    os.environ["OPENAI_API_KEY"] = api_key

    # --- 2. Dynamically Create Agents ---
    crew_agents = []
    for agent_data in agents:
        agent = Agent(
            role=agent_data.get('system_prompt', ''),
            goal=agent_data.get('system_prompt', ''), 
            backstory=f"You are an expert agent with ID {agent_data.get('agent_id', 'unknown')} tasked with fulfilling your role.",
            verbose=True,
            allow_delegation=False
        )
        crew_agents.append(agent)

    # --- 3. Dynamically Create Tasks ---
    crew_tasks = []

    # First task contains input prompt
    initial_task = Task(
        description=main_prompt,
        expected_output="The processed output based on the initial prompt.",
        agent=crew_agents[0]
    )
    crew_tasks.append(initial_task)

    # Subsequent tasks that build on each other
    # Output of each previous task implicitly passed onto the next
    for i in range(1, len(crew_agents)):
        task = Task(
            description="Take the result from the previous step and continue the process according to your role.",
            expected_output="The processed output based on your specific role and the previous step's context.",
            agent=crew_agents[i],
        )
        crew_tasks.append(task)

    # --- 4. Assemble and Run the Crew ---
    sequential_crew = Crew(
        agents=crew_agents,
        tasks=crew_tasks,
        process=Process.sequential,
        verbose=True
    )

    print("Kicking off the crew...")
    result = sequential_crew.kickoff()
    print("Crew execution finished.")

    return {"result": result.raw}