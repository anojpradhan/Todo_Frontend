import { useEffect, useRef, useState } from "react";
import Sidebar from "../Components/sidebar";
import TodoInput from "../Components/card-input";
import Card from "../Components/card";
import DatePriority from "../Components/priority-input";
import Login from "./login";
import { useNavigate } from "react-router";
interface TodoItem {
  id: number;
  title: string;
  description: string;
  importance: string;
  status: "pending";
  deadline: Date;
}

function Todo() {
  const [showInputForm, setShowInputForm] = useState(false);
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState("");
  const priorityArray = ["high", "medium", "low"];
  const [importance, setImportance] = useState("high");
  let defaultDate = new Date();
  const [deadline, setDeadline] = useState<Date>(defaultDate);
  // const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todos, setTodos] = useState<TodoItem[] | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

// Token checking while each reload 
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If the token doesn't exist, navigate to login
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
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
    setImportance("high");
    setShowInputForm(false);
  };

  // add todo items in array even in edit and add new both
  // const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (isTitleSame()) {
  //     const sameTitleExists = todos?.some(
  //       (todo, index) => todo.title === title && index !== isEditingIndex
  //     );

  //     if (sameTitleExists) {
  //       setError("Title already exists");
  //       return;
  //     }
  //   }
  //   if (todos?.length) {
  //     // todos is null initially
  //     if (isEditingIndex !== null) {
  //       setShowInputForm(true);
  //       const newTodos = [...todos];
  //       newTodos[isEditingIndex] = { title, description, importance, deadline };
  //       setTodos(newTodos);
  // setIsEditingIndex(null);
  // setIsEditing(false);
  // setButtonClicked(false);
  //     } else {
  //       setTodos([...todos, { title, description, importance, deadline }]);
  //     }
  //   } else {
  //     setTodos([{ title, description, importance, deadline }]);
  //   }
  //   setTitle("");
  //   setDescription("");
  //   setError("");
  //   setShowInputForm(false);
  //   setButtonClicked(false);
  // };

  
  // // checks for same title
  const isTitleSame = () => {
    return todos?.some((todo) => todo.title === title);
  };

  // /* store data in local storage */
  // useEffect(() => {
  //   if (todos !== null) {
  //     localStorage.setItem("todos", JSON.stringify(todos));
  //   }
  // }, [todos]);
  // fetch data from local storage
  // useEffect(() => {
  //   const todos = JSON.parse(localStorage.getItem("todos") || "[]");
  //   setTodos(todos);
  // }, []);
  //for delete
  const handleDelete = (id: number) => {
    try {
      fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTczNTYyNTc5MywiZXhwIjoxNzM2NDg5NzkzfQ.uPfdLcfhc8SzXLaZkluS7b4N4tafkX18DClVMLc3MM8`,
          "Content-Type": "application/json",
        },
      });
      setButtonClicked(false);
    } catch (err) {
      console.log(err);
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
      setImportance(editingTodo.importance);
      setDeadline(editingTodo.deadline);
    }
    setShowInputForm(true);
  };

  // create todo in database
  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      return;
    }
    //   e.preventDefault();
    if (isTitleSame()) {
      const sameTitleExists = todos?.some(
        (todo, index) => todo.title === title && index !== isEditingIndex
      );

      if (sameTitleExists) {
        setError("Title already exists");
        return;
      }
    }
    try {
      if (isEditingIndex !== null) {
        console.log("Hello");
        const editId = todos ? todos[isEditingIndex].id : null;
        const response = await fetch(`http://localhost:3000/tasks/${editId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            status: "pending",
            deadline,
            importance,
          }),
        });

        if (response.ok) {
          const updatedTodo = await response.json();
          const newTodos = todos ? [...todos] : [];
          console.log(newTodos);
          newTodos[isEditingIndex] = updatedTodo;
          console.log(newTodos);
          setTodos(newTodos);
          setIsEditingIndex(null);
          setIsEditing(false);
          setButtonClicked(false);
        } else {
          console.error("Failed to update todo:", response.status);
          setError("Failed to update todo");
        }
      } else {
        // Creating a new todo
        const createdTodo = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            status: "pending",
            deadline: deadline,
            importance: importance,
          }),
        });
        const data = await createdTodo.json();
        // console.log(createdTodo);
        // Adding the newly created todo to the state
        const newTodos = todos ? [...todos, data] : [data];
        setTodos(newTodos);
        console.log(todos);
        setButtonClicked(false);
      }

      // Resetting the form
      setTitle("");
      setDescription("");
      setImportance("");
      setDeadline(defaultDate);
      setError("");
      setShowInputForm(false);
    } catch (error) {
      console.error("Failed to save todo", error);
      setError("Failed to save todo");
    }
  };

  // fetch todo from the database
  const fetchTodos = async () => {
    if (!token) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        // console.log(todos);
      } else {
        console.error("Failed to fetch tasks:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, [token]);

  if (!token) {
    return <Login></Login>;
  }
  return (
    <>
      <div className="container">
        <div className="sidebar-container">
          <Sidebar onAddButtonClick={handleAddButtonClick} />
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
                    <div className="date-importance-container">
                      <DatePriority
                        priority={importance}
                        importance={priorityArray}
                        priorityInput={setImportance}
                        dateInput={setDeadline}
                        date={deadline}
                      />
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
                      disabled={!!error}
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
                {todos.map((todo, index) => (
                  <Card
                    key={index}
                    title={todo.title}
                    description={todo.description}
                    prioriy={todo.importance}
                    deadline={todo.deadline} // Pass as Date | null
                    onDelete={() => handleDelete(todo.id)}
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
export default Todo;
