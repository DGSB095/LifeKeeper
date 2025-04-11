from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

    # Define the relationship to Task
    tasks = relationship("Task", back_populates="section")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=True)
    due_date = Column(DateTime, nullable=True)
    should_repeat = Column(Boolean, default=False)
    delete_on_complete = Column(Boolean, default=False)
    completed = Column(Boolean, default=False)

    # Define the relationship to Section
    section = relationship("Section", back_populates="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "section_id": self.section_id,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "should_repeat": self.should_repeat,
            "completed": self.completed,
            "delete_on_complete": self.delete_on_complete,
        }