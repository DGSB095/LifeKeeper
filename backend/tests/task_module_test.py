import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.task_manager import TaskManager
from backend.models import Task


@pytest.fixture
def tmanager():
    manager = TaskManager()
    manager.add_section("Work")
    manager.add_section("Personal")
    return manager


def test_add_new_task(tmanager):
    task = Task(
        id=0,
        content="Task description",
        section="Work",
        due_date="01.01.2022",
        should_repeat=False,
        completed=False,
        delete_on_complete=True,
    )
    tmanager.add_task(task)
    tasks = tmanager.get_tasks()
    assert len(tasks) == 1
    assert tasks[0].content == "Task description"
    assert tasks[0].section == "Work"


def test_complete_task(tmanager):
    task = Task(
        id=0,
        content="Task description",
        section=1,
        due_date="01.01.2022",
        should_repeat=False,
        completed=False,
        delete_on_complete=True,
    )
    tmanager.add_task(task)
    task = tmanager.get_task(0)
    task.completed = True
    assert task.completed == True


def test_remove_task(tmanager):
    task = Task(
        id=0,
        content="Task description",
        section=1,
        due_date="01.01.2022",
        should_repeat=False,
        completed=False,
        delete_on_complete=True,
    )
    tmanager.add_task(task)
    tmanager.remove_task(0)
    tasks = tmanager.get_tasks()
    assert len(tasks) == 0


def test_update_task(tmanager):
    task = Task(
        id=0,
        content="Task description",
        section=1,
        due_date="01.01.2022",
        should_repeat=False,
        completed=False,
        delete_on_complete=True,
    )
    tmanager.add_task(task)
    updated_task = Task(
        id=0,
        content="Updated description",
        section=2,
        due_date="02.02.2022",
        should_repeat=True,
        completed=True,
        delete_on_complete=False,
    )
    tmanager.update_task(0, updated_task)
    task = tmanager.get_task(0)
    assert task.content == "Updated description"
    assert task.section == 2
    assert task.due_date == "02.02.2022"
    assert task.should_repeat == True
    assert task.completed == True
    assert task.delete_on_complete == False


def test_remove_nonexistent_task(tmanager):
    task = Task(
        id=0,
        content="Task description",
        section=1,
        due_date="01.01.2022",
        should_repeat=False,
        completed=False,
        delete_on_complete=True,
    )
    tmanager.add_task(task)
    tmanager.remove_task(999)
    tasks = tmanager.get_tasks()
    assert len(tasks) == 1


def test_add_task_to_nonexistent_section(tmanager):
    with pytest.raises(ValueError):
        task = Task(
            id=1,
            content="Task description",
            section="Nonexistent",
            due_date="01.01.2022",
            should_repeat=False,
            completed=False,
            delete_on_complete=True,
        )
        tmanager.add_task(task)
