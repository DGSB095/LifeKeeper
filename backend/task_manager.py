from sqlalchemy.orm import sessionmaker
from models import Task, Section, Base
from sqlalchemy import create_engine

class TaskManager:
    def __init__(self, db_url="postgresql://dgsb:12345pass@db:5432/dgsb_notes"):
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        # Add default sections
        session = self.Session()
        if not session.query(Section).all():
            default_sections = ["Work", "Personal", "Shopping"]
            for section_name in default_sections:
                session.add(Section(name=section_name))
            session.commit()
        session.close()

    def add_section(self, section_name):
        session = self.Session()
        section = Section(name=section_name)
        session.add(section)
        session.commit()
        session.close()

    def remove_section(self, section_name):
        session = self.Session()
        section = session.query(Section).filter_by(name=section_name).first()
        if not section:
            raise ValueError(f"Section '{section_name}' does not exist")
        session.delete(section)
        session.commit()
        session.close()

    def add_task(self, task):
        session = self.Session()
        section = None
        if task.section_id:
            section = session.query(Section).filter_by(id=task.section_id).first()
            if not section:
                raise ValueError(f"Section with ID '{task.section_id}' does not exist")
        db_task = Task(
            content=task.content,
            section_id=section.id if section else None,
            due_date=task.due_date,
            should_repeat=task.should_repeat,
            completed=False,  # Always default to False
            delete_on_complete=task.delete_on_complete,
        )
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        session.close()
        return db_task

    def get_tasks(self):
        session = self.Session()
        tasks = session.query(Task).all()
        session.close()
        return [task.to_dict() for task in tasks]

    def get_task(self, task_id):
        session = self.Session()
        task = session.query(Task).filter_by(id=task_id).first()
        session.close()

    def get_sections(self):
        session = self.Session()
        sections = session.query(Section).all()
        session.close()
        return sections