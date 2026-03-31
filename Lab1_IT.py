import os
import json
from datetime import datetime


def greet(name: str) -> str:
    if not name or not name.strip():
        return "Hello, Stranger!"
    return f"Hello, {name.strip().title()}!"


def add(a: float, b: float) -> float:
    return a + b


def subtract(a: float, b: float) -> float:
    return a - b


def multiply(a: float, b: float) -> float:
    return a * b


def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Division by zero is not allowed")
    return a / b


def is_palindrome(text: str) -> bool:
    cleaned = ''.join(ch.lower() for ch in text if ch.isalnum())
    return cleaned == cleaned[::-1]


def factorial(n: int) -> int:
    if n < 0:
        raise ValueError("Negative numbers not allowed")
    if n == 0:
        return 1
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result


def save_to_file(filename: str, data: dict) -> None:
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def load_from_file(filename: str) -> dict:
    if not os.path.exists(filename):
        return {}
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)


class TodoList:
    def __init__(self):
        self.tasks = []

    def add_task(self, description: str) -> dict:
        if not description.strip():
            raise ValueError("Task description cannot be empty")
        task = {
            "id": len(self.tasks) + 1,
            "description": description.strip(),
            "created_at": datetime.now().isoformat(),
            "done": False
        }
        self.tasks.append(task)
        return task

    def mark_done(self, task_id: int) -> bool:
        for task in self.tasks:
            if task["id"] == task_id:
                task["done"] = True
                return True
        return False

    def remove_task(self, task_id: int) -> bool:
        for task in self.tasks:
            if task["id"] == task_id:
                self.tasks.remove(task)
                return True
        return False

    def list_tasks(self) -> list:
        return self.tasks


def pause():
    input("\nPress SPACE + Enter to continue...")


def main():
    print("Welcome to the Interactive Demo Program!")
    todo = TodoList()
    user = None

    while True:
        print("\nChoose an action:")
        print("1. Greeting")
        print("2. Math operations")
        print("3. Palindrome check")
        print("4. Factorial")
        print("5. Manage ToDo list")
        print("6. Save/Load data")
        print("0. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            name = input("Enter a name: ")
            user = name
            print(greet(name))
            pause()

        elif choice == "2":
            try:
                a = float(input("Enter first number: "))
                b = float(input("Enter second number: "))
                print(f"{a} + {b} = {add(a, b)}")
                print(f"{a} - {b} = {subtract(a, b)}")
                print(f"{a} * {b} = {multiply(a, b)}")
                try:
                    print(f"{a} / {b} = {divide(a, b)}")
                except ValueError as e:
                    print("Error:", e)
            except ValueError:
                print("Invalid input, please enter numbers.")
            pause()

        elif choice == "3":
            text = input("Enter text to check: ")
            print("Palindrome?", is_palindrome(text))
            pause()

        elif choice == "4":
            try:
                n = int(input("Enter a number: "))
                print(f"Factorial of {n} = {factorial(n)}")
            except ValueError as e:
                print("Error:", e)
            pause()

        elif choice == "5":
            print("\nToDo Menu:")
            print("a. Add task")
            print("b. Mark task done")
            print("c. Remove task")
            print("d. List tasks")
            sub = input("Choose option: ")

            if sub == "a":
                desc = input("Enter task description: ")
                try:
                    task = todo.add_task(desc)
                    print("Added:", task)
                except ValueError as e:
                    print("Error:", e)
            elif sub == "b":
                tid = int(input("Enter task id: "))
                if todo.mark_done(tid):
                    print("Task marked as done.")
                else:
                    print("Task not found.")
            elif sub == "c":
                tid = int(input("Enter task id: "))
                if todo.remove_task(tid):
                    print("Task removed.")
                else:
                    print("Task not found.")
            elif sub == "d":
                print("Tasks:", todo.list_tasks())
            pause()

        elif choice == "6":
            filename = "demo_data.json"
            print("a. Save data")
            print("b. Load data")
            sub = input("Choose option: ")
            if sub == "a":
                data = {"user": user, "tasks": todo.list_tasks()}
                save_to_file(filename, data)
                print("Data saved.")
            elif sub == "b":
                loaded = load_from_file(filename)
                print("Loaded data:", loaded)
            pause()

        elif choice == "0":
            print("Goodbye!")
            break

        else:
            print("Invalid choice, try again.")
            pause()


if __name__ == "__main__":
    main()