from typing import Protocol, runtime_checkable
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ollama import AsyncClient
import uvicorn
import json

@runtime_checkable
class ChatEngine(Protocol):
    async def chat(self, request: dict) -> StreamingResponse:
        """
        Args:
            request (dict): A dictionary containing messages and who sent them (user or AI)
        Returns:
            StreamingResponse: A streaming response containing the generated text
        """
        ...

class OllamaChatEngine:
    def __init__(self, model_name: str="llama3.2"):
        self.model_name = model_name
        self.ollama = AsyncClient(host="http://localhost:11434")

    async def chat(self, request: dict) -> StreamingResponse:
        """
        Args:
            request (dict): A dictionary containing messages and who sent them (user or AI)
        Returns:
            StreamingResponse: A streaming response containing the generated text
        """
        messages = request["messages"]
        model = request.get("model") or self.model_name

        async def generate():
            """
            Generates a response chunk by chunk based on the user's message
            Need to add the context of the ingested documents to the messages before sending to the model
            """
            async for chunk in await self.ollama.chat(
                model=model,
                messages=messages,
                stream=True
            ):
                content = chunk["message"]["content"]
                yield f"data: {json.dumps(content)}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            },
        )

class ChatServer:
    def __init__(self, chat_engine: ChatEngine, port: int = 8000):
        self.chat_engine = chat_engine
        self.app = FastAPI()
        self.port=port
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.app.add_api_route("/chat", self.chat_engine.chat, methods=["POST"])

    def start(self):
        uvicorn.run(app=self.app, host="0.0.0.0", port=self.port, reload=False)