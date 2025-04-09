from sqlalchemy import Column, Integer, String, Boolean, DateTime, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()

class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String, nullable=False)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    due_date = Column(DateTime, nullable=True)
    should_repeat = Column(Boolean, default=False)
    completed = Column(Boolean, default=False)
    delete_on_complete = Column(Boolean, default=True)

    section = relationship("Section", back_populates="tasks")

Section.tasks = relationship("Task", back_populates="section")