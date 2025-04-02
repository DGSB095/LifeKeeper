import sys
import os
import pytest

# Add the directory containing task_manager.py to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from task_manager import Task, TaskManager

@pytest.fixture(autouse=True)
def setup_tmanager():
    global tmanager
    tmanager = TaskManager([], [], 0)

def test_add_new_task(monkeypatch):
    inputs = iter(['Task description', '1', '01.01.2022', 'нет', 'Y'])
    monkeypatch.setattr('builtins.input', lambda _: next(inputs))
    tmanager.add_task(False, 'Task description', 1, '01.01.2022', 'нет', True)
    tasks = tmanager.get_tasks()
    assert len(tasks) == 1
    assert tasks[0].content == 'Task description'
    assert tasks[0].section == 1
    assert tasks[0].due_date == '01.01.2022'
    assert tasks[0].should_repeat == 'нет'
    assert tasks[0].delete_on_complete == True

def test_complete_task(monkeypatch):
    tmanager.add_task(False, 'Task description', 1, '01.01.2022', 'нет', True)
    task = tmanager.get_task(0)
    task.complete()
    assert task.completed == True

def test_remove_task(monkeypatch):
    tmanager.add_task(False, 'Task description', 1, '01.01.2022', 'нет', True)
    tmanager.remove_task(0)
    tasks = tmanager.get_tasks()
    assert len(tasks) == 0

def test_add_section():
    tmanager.add_section('Section 1')
    tmanager.add_section('Section 2')
    assert tmanager.sections == ['Section 1', 'Section 2']
    assert tmanager.add_section('Section 1') == False

def test_get_tasks_by_section():
    test_add_section()
    tmanager.add_task(False, 'Task description', 1, '01.01.2022', 'нет', True)
    tmanager.add_task(False, 'Task description', 2, '01.01.2022', 'нет', True)
    tasks = tmanager.get_tasks_by_section(1)
    assert len(tasks) == 1
    assert tasks[0].section == 1

def test_edit_section():
    tmanager.add_section('Section 1')
    tmanager.add_section('Section 2')
    tmanager.edit_section(1, 'Section 3')
    assert tmanager.sections == ['Section 1', 'Section 3']

def test_edit_task(monkeypatch):
    tmanager.add_task(False, 'Task description', 1, '01.01.2022', 'нет', True)
    inputs = iter(['Task description edited', '2', '02.02.2022', 'каждые 3 дня', 'N'])
    monkeypatch.setattr('builtins.input', lambda _: next(inputs))
    tmanager.edit_task(0, 'Task description edited', 2, '02.02.2022', 'каждые 3 дня', False)
    task = tmanager.get_task(0)
    assert task.content == 'Task description edited'
    assert task.section == 2
    assert task.due_date == '02.02.2022'
    assert task.should_repeat == 'каждые 3 дня'
    assert task.delete_on_complete == False

def test_remove_section():
    test_add_section()
    tmanager.remove_section(1)
    assert tmanager.sections == ['Section 1']