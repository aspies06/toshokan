from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from ollama import AsyncClient
import json
import uvicorn

# create the API and add middleware to allow the frontend to read responses
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# create an async client that points to the server the Ollama decoder is running on (currently using llama3.2)
ollama = AsyncClient(host="http://localhost:11434")


@app.post("/chat")
async def chat(request: dict):
    """
    Args:
        request (dict): A dictionary containing messages and who sent them (user or AI)
    Returns:
        StreamingResponse: A streaming response containing the generated text
    """
    messages = request["messages"]

    async def generate():
        """
        Generates a response chunk by chunk based on the user's message
        Need to add the context of the ingested documents to the messages before sending to the model
        """
        async for chunk in await ollama.chat(
            model="llama3.2",
            messages=messages,
            stream=True
        ):
            content = chunk["message"]["content"]
            yield f"data: {json.dumps(content)}\n\n"
        yield f"data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        },
    )

# Main entry point for the script
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)