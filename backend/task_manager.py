from sqlalchemy.orm import sessionmaker
from models import Task, Section, Base
from sqlalchemy import create_engine
from schemas import TaskSchema

class TaskManager:
    def __init__(self, db_url="postgresql://dgsb:12345pass@db:5432/dgsb_notes"):
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        # Add default sections
        session = self.Session()
        if not session.query(Section).all():
            default_sections = [
                {"name": "Work", "description": "Work-related tasks"},
                {"name": "Personal", "description": "Personal tasks"},
                {"name": "Shopping", "description": "Shopping list"},
            ]
            for section in default_sections:
                session.add(Section(**section))
            session.commit()
        session.close()

    def add_section(self, section_name, section_description=None):
        session = self.Session()
        try:
            section = Section(name=section_name, description=section_description)
            session.add(section)
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def reset(self):
        session = self.Session()
        try:
            session.query(Task).delete()
            session.query(Section).delete()
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def remove_section(self, section_name):
        session = self.Session()
        section = session.query(Section).filter_by(name=section_name).first()
        if not section:
            raise ValueError(f"Section '{section_name}' does not exist")
        session.delete(section)
        session.commit()
        session.close()

    def add_task(self, task: TaskSchema):
        session = self.Session()
        try:
            db_task = Task(
                content=task.content,
                section_id=task.section_id,
                due_date=task.due_date,
                should_repeat=task.should_repeat,
                delete_on_complete=task.delete_on_complete,
                completed= False,
            )
            session.add(db_task)
            session.commit()
            session.refresh(db_task)
            return db_task.to_dict()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def remove_task(self, task_id: int):
        session = self.Session()
        task = session.query(Task).filter_by(id=task_id).first()
        if not task:
            raise ValueError(f"Task with ID '{task_id}' does not exist")
        session.delete(task)
        session.commit()
        session.close()

    def get_task(self, task_id: int):
        session = self.Session()
        task = session.query(Task).filter_by(id=task_id).first()
        if not task:
            raise ValueError(f"Task with ID '{task_id}' does not exist")
        session.close()
        return task.to_dict()

    def update_task(self, task_id: int, updated_task: TaskSchema):
        session = self.Session()
        task = session.query(Task).filter_by(id=task_id).first()
        if not task:
            raise ValueError(f"Task with ID '{task_id}' does not exist")
        try:
            # Update task fields with validation
            task.content = updated_task.content or task.content
            task.section_id = updated_task.section_id or task.section_id
            task.due_date = updated_task.due_date or task.due_date
            task.should_repeat = updated_task.should_repeat if updated_task.should_repeat is not None else task.should_repeat
            task.delete_on_complete = updated_task.delete_on_complete if updated_task.delete_on_complete is not None else task.delete_on_complete

            if task.delete_on_complete and task.completed:
                session.delete(task)
            else:
                session.commit()
                session.refresh(task)

            return task.to_dict()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def complete_task(self, task_id: int):
        session = self.Session()
        task = session.query(Task).filter_by(id=task_id).first()
        if not task:
            raise ValueError(f"Task with ID '{task_id}' does not exist")
        try:
            task.completed = True
            if task.delete_on_complete == True:
                self.remove_task(task_id)
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def get_tasks(self):
        session = self.Session()
        tasks = session.query(Task).all()
        session.close()
        return [task.to_dict() for task in tasks]


    def get_sections(self):
        session = self.Session()
        sections = session.query(Section).all()
        session.close()
        return sections