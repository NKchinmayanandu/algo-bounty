from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.tasks import router as tasks_router
from app.routes.users import router as users_router
from app.db.session import Base, engine
from app.realtime.tasks import manager
from sqlalchemy import inspect, text
import uvicorn

app = FastAPI(title="Trustless Task Bounty API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
app.include_router(users_router, prefix="/users", tags=["users"])

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    ensure_submission_columns()


def ensure_submission_columns():
    """
    Lightweight startup sync for legacy databases missing newer submission fields.
    """
    inspector = inspect(engine)
    if "submissions" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("submissions")}
    statements = []
    if "tx_hash" not in existing_columns:
        statements.append("ALTER TABLE submissions ADD COLUMN tx_hash VARCHAR")
    if "block_round" not in existing_columns:
        statements.append("ALTER TABLE submissions ADD COLUMN block_round INTEGER")

    if not statements:
        return

    with engine.begin() as conn:
        for statement in statements:
            conn.execute(text(statement))

@app.websocket("/ws/tasks")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # We just keep connection open, pushing events
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
