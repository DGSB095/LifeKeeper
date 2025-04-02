from pydantic import BaseModel
from typing import Optional

class Task(BaseModel):
    id: int
    content: str
    section: int
    due_date: Optional[str] = None
    should_repeat: Optional[str] = None
    completed: bool = False
    delete_on_complete: bool = True