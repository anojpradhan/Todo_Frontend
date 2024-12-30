import { useEffect, useRef, useState } from "react";
import Sidebar from "./Components/sidebar";
import TodoInput from "./Components/card-input";
import Card from "./Components/card";
import DatePriority from "./Components/priority-input";
interface TodoItem {
  title: string;
  description: string;
  priority: string;
  deadline: Date | null;
}

function App() {
  const [showInputForm, setShowInputForm] = useState(false);
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState("");
  const priorityArray = ["high", "medium", "low"];
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  // const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todos, setTodos] = useState<TodoItem[] | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  // Handling input form close by clicking
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !event.composedPath().includes(buttonRef.current)
      ) {
        setButtonClicked(true);
      }
    };
    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (buttonClicked) {
      const handleClick = (event: MouseEvent) => {
        if (
          formRef.current &&
          !event.composedPath().includes(formRef.current)
        ) {
          setButtonClicked(false);
          setShowInputForm(false);
          console.log("Button was clicked outside!");
        }
      };
      document.body.addEventListener("click", handleClick);

      return () => {
        document.body.removeEventListener("click", handleClick);
      };
    }
  }, [buttonClicked]);

  // add task button clicking
  const handleAddButtonClick = () => {
    setShowInputForm(true);
  };
  // cancel or closing form
  const handleCloseInputForm = () => {
    setError("");
    if (isEditing) {
      setIsEditing(false);
    }
    if (buttonClicked) {
      setButtonClicked(false);
    }
    setTitle("");
    setDescription("");
    setShowInputForm(false);
  };

  // add todo items in array even in edit and add new both
  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isTitleSame()) {
      const sameTitleExists = todos?.some(
        (todo, index) => todo.title === title && index !== isEditingIndex
      );

      if (sameTitleExists) {
        setError("Title already exists");
        return;
      }
    }
    if (todos?.length) {
      // todos is null initially
      if (isEditingIndex !== null) {
        setShowInputForm(true);
        const newTodos = [...todos];
        newTodos[isEditingIndex] = { title, description, priority, deadline };
        setTodos(newTodos);
        setIsEditingIndex(null);
        setIsEditing(false);
        setButtonClicked(false);
      } else {
        setTodos([...todos, { title, description, priority, deadline }]);
      }
    } else {
      setTodos([{ title, description, priority, deadline }]);
    }
    setTitle("");
    setDescription("");
    setError("");
    setShowInputForm(false);
    setButtonClicked(false);
  };
  // checks for same title
  const isTitleSame = () => {
    return todos?.some((todo) => todo.title === title);
  };

  /* store data in local storage */
  useEffect(() => {
    if (todos !== null) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  // fetch data from local storage
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    setTodos(todos);
  }, []);
  //for delete
  const handleDelete = (index: number) => {
    if (todos) {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      setTodos(newTodos);
    }
  };
  // for edit
  const handleEdit = (index: number) => {
    setIsEditingIndex(index);
    setIsEditing(true);
    const editingTodo = todos ? todos[index] : null;
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description);
      setPriority(editingTodo.priority);
      setDeadline(editingTodo.deadline);
    }
    setShowInputForm(true);
  };
  return (
    <>
      <div className="container">
        <div className="sidebar-container">
          <Sidebar onAddButtonClick={() => handleAddButtonClick()}></Sidebar>
        </div>
        <div className="content-container">
          {showInputForm && (
            <div className="overlay">
              <div ref={formRef} className="input-dialog">
                <form onSubmit={addTodo} className="input-form">
                  <div className="inputs">
                    <div className="input-group">
                      <TodoInput
                        value={title}
                        name="Title"
                        placeholder="Enter Title"
                        onChange={setTitle}
                      />
                      {error && <p className="error">Title already exists</p>}
                    </div>
                    <div className="input-group">
                      <TodoInput
                        value={description}
                        name="Description"
                        placeholder="Enter Description"
                        onChange={setDescription}
                        required={false}
                      />
                    </div>
                    <div className="date-priority-container">
                      <DatePriority
                        priority={priorityArray}
                        priorityInput={setPriority}
                        dateInput={setDeadline}
                      ></DatePriority>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      type="button"
                      onClick={handleCloseInputForm}
                      className="btn cancel"
                    >
                      Cancel
                    </button>
                    <button
                      ref={buttonRef}
                      type="submit"
                      className="btn submit"
                    >
                      {isEditing ? "Save" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div>
            {todos && todos.length > 0 && (
              <div className="card-container">
                {todos?.map((todo, index) => (
                  <Card
                    key={index}
                    title={todo.title}
                    description={todo.description}
                    prioriy={todo.priority}
                    deadline={todo.deadline} // Pass as Date | null
                    onDelete={() => handleDelete(index)}
                    onEdit={() => handleEdit(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
