from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskSchema(BaseModel):
    id: int
    content: str
    section_id: Optional[int]
    due_date: Optional[datetime]
    should_repeat: bool
    delete_on_complete: bool
    completed: bool

    class Config:
        orm_mode = True


class SectionSchema(BaseModel):
    name: str
    description: Optional[str]

