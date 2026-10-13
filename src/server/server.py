import argparse
from chat import OllamaChatEngine, ChatServer

# Main entry point for the script
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a FastAPI server for the chatbot")
    parser.add_argument("--model", type=str, default="llama3.2", help="Model to use for the chatbot")
    parser.add_argument("--port", type=int, default=8000, help="Port number to run the server on")

    args = parser.parse_args()

    engine = OllamaChatEngine(args.model)
    server = ChatServer(engine, args.port)
    server.start()