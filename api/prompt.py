from fastapi import FastAPI
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI


# Initialize the FastAPI app
app = FastAPI(
    title="CrewAI Sequential Agent API",
    description="An API to run a sequence of CrewAI agents.",
)


@app.post("/prompt/")
async def run_sequential_crew(request):
    """
    This endpoint takes a list of agents and a main prompt,
    creates a sequential crew, runs the process, and returns the final result.
    """
    if not request.agents:
        return {"error": "Agent list cannot be empty."}

    if not request.api_key:
        return {"error": "No API key provided."}


    # --- 1. Initialise the LLM ---
    llm = ChatGoogleGenerativeAI(
            model="gemini-pro",    # gemini-1.5-flash-latest OR gemini-1.5-pro-latest OR gemini-pro
            verbose=True,
            temperature=0.7,
            google_api_key=request.api_key
        )

    # --- 2. Dynamically Create Agents ---
    crew_agents = []
    for agent_data in request.agents:
        agent = Agent(
            role=agent_data.system_prompt,
            goal=agent_data.system_prompt, 
            backstory=f"You are an expert agent with ID {agent_data.agent_id} tasked with fulfilling your role.",
            verbose=True,
            allow_delegation=False,
            llm=llm
        )
        crew_agents.append(agent)

    # --- 3. Dynamically Create Tasks ---
    crew_tasks = []

    # First task contains input prompt
    initial_task = Task(
        description=request.main_prompt,
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
        verbose=2
    )

    print("Kicking off the crew...")
    result = sequential_crew.kickoff()
    print("Crew execution finished.")

    return {"result": result}