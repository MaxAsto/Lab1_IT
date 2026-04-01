import pytest
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from unittest.mock import mock_open
from Lab1_IT import (
    greet, add, subtract, multiply, divide,
    is_palindrome, factorial,
    save_to_file, load_from_file,
    TodoList, pause, main
)

def test_greet_valid_name():
    assert greet("Maks") == "Hello, Maks!"

def test_greet_empty_name():
    assert greet("") == "Hello, Stranger!"

def test_add():
    assert add(2, 3) == 5

def test_subtract():
    assert subtract(10, 4) == 6

def test_multiply():
    assert multiply(3, 7) == 21

def test_divide_normal():
    assert divide(10, 2) == 5

def test_divide_negative():
    assert divide(-10, 2) == -5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)

def test_palindrome_true():
    assert is_palindrome("level") is True

def test_palindrome_false():
    assert is_palindrome("hello") is False

def test_palindrome_with_spaces_and_case():
    assert is_palindrome("A man a plan a canal Panama") is True

def test_factorial_positive():
    assert factorial(5) == 120

def test_factorial_zero():
    assert factorial(0) == 1

def test_factorial_negative():
    with pytest.raises(ValueError):
        factorial(-5)

def test_todo_add_and_remove():
    todo = TodoList()
    task = todo.add_task("Test task")
    assert task["description"] == "Test task"
    assert todo.remove_task(task["id"]) is True

def test_todo_empty_description():
    todo = TodoList()
    with pytest.raises(ValueError):
        todo.add_task("   ")

def test_todo_mark_done_true():
    todo = TodoList()
    task = todo.add_task("Task")
    assert todo.mark_done(task["id"]) is True

def test_todo_mark_done_false():
    todo = TodoList()
    assert todo.mark_done(999) is False

def test_todo_remove_task_false():
    todo = TodoList()
    assert todo.remove_task(999) is False

def test_todo_list_tasks():
    todo = TodoList()
    todo.add_task("Task 1")
    todo.add_task("Task 2")
    tasks = todo.list_tasks()
    assert len(tasks) == 2



def test_load_from_file_not_exists(tmp_path):
    file_path = tmp_path / "nofile.json"
    result = load_from_file(str(file_path))
    assert result == {}

def test_load_from_file_with_mock(mocker):
    fake_data = '{"key": "value"}'
    m_open = mock_open(read_data=fake_data)
    mocker.patch("builtins.open", m_open)
    mocker.patch("os.path.exists", return_value=True)  

    result = load_from_file("fake.json")
    assert result == {"key": "value"}


def test_pause(monkeypatch):
    # емулюємо натискання клавіші
    monkeypatch.setattr("builtins.input", lambda _: " ")
    pause()  # просто перевіряємо, що викликається без помилок

def test_main_greeting(monkeypatch, capsys):
    inputs = iter(["1", "Maks", " ", "0"])
    monkeypatch.setattr("builtins.input", lambda _: next(inputs))
    main()
    captured = capsys.readouterr()
    assert "Hello, Maks!" in captured.out

def test_main_math(monkeypatch, capsys):
    inputs = iter(["2", "10", "5", " ", "0"])
    monkeypatch.setattr("builtins.input", lambda _: next(inputs))
    main()
    captured = capsys.readouterr()
    assert "10.0 + 5.0 = 15.0" in captured.out

def test_main_palindrome(monkeypatch, capsys):
    inputs = iter(["3", "level", " ", "0"])
    monkeypatch.setattr("builtins.input", lambda _: next(inputs))
    main()
    captured = capsys.readouterr()
    assert "Palindrome? True" in captured.out

def test_main_factorial(monkeypatch, capsys):
    inputs = iter(["4", "5", " ", "0"])
    monkeypatch.setattr("builtins.input", lambda _: next(inputs))
    main()
    captured = capsys.readouterr()
    assert "Factorial of 5 = 120" in captured.out

def test_main_todo(monkeypatch, capsys):
    inputs = iter(["5", "a", "Test task", " ", "5", "d", " ", "0"])
    monkeypatch.setattr("builtins.input", lambda _: next(inputs))
    main()
    captured = capsys.readouterr()
    assert "Test task" in captured.out
    assert "Tasks:" in captured.out

def test_main_save_load(monkeypatch, capsys, tmp_path):
    filename = tmp_path / "demo_data.json"
    inputs = iter(["6", "a", " ", "6", "b", " ", "0"])
    monkeypatch.setattr("builtins.input", lambda _: next(inputs))
    monkeypatch.setattr("Lab1_IT.save_to_file", lambda f, d: filename.write_text("{}", encoding="utf-8"))
    monkeypatch.setattr("Lab1_IT.load_from_file", lambda f: {"user": None, "tasks": []})
    main()
    captured = capsys.readouterr()
    assert "Data saved." in captured.out
    assert "Loaded data:" in captured.out
