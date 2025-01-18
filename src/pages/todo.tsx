import { useContext, useEffect, useRef, useState } from "react";
import Sidebar from "../Components/sidebar";
import TodoInput from "../Components/card-input";
import Card from "../Components/card";
import DatePriority from "../Components/priority-input";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/authcontext";
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
  const defaultDate = new Date();
  const [deadline, setDeadline] = useState<Date>(defaultDate);
  // const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todos, setTodos] = useState<TodoItem[] | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // const [buttonClicked, setButtonClicked] = useState(false);
  // const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Token checking while each reload
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  // Handle outside click from form
  useEffect(() => {
    if (showInputForm) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          formRef.current &&
          !event.composedPath().includes(formRef.current)
        ) {
          setShowInputForm(false);
        }
      };
      // Use a timeout to delay adding the event listener
      const timeoutId = setTimeout(() => {
        document.body.addEventListener("click", handleClickOutside);
      }, 0);

      // Cleanup event listener
      return () => {
        clearTimeout(timeoutId);
        document.body.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showInputForm]);

  // add task button clicking
  const handleAddButtonClick = async() => {
    setShowInputForm(true);
  };
  // cancel or closing form
  const handleCloseInputForm = async () => {
    // setError("");
    if (isEditing) {
      setIsEditing(false);
    }
    // if (buttonClicked) {
    //   // setButtonClicked(false);
    // }
    setTitle("");
    setDescription("");
    setImportance("high");
    setShowInputForm(false);
  };

  //for delete
  const handleDelete = async (id: number)=> {
    try {
      console.log(id);
      const deletedTodo= await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (deletedTodo.ok) {
        const data = await deletedTodo.json();
        console.log(data);
        console.log("Deleted");
      } else {
        console.error("Failed to fetch tasks:", deletedTodo.status);
      }
      // console.log("deleted");
    } catch (err) {
      console.log(err);
    }
    fetchTodos();
  };

  // for edit
  const handleEdit = async (index: number) => {
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

    try {
      if (isEditingIndex !== null) {
        console.log("Is editing");
        const editId = todos ? todos[isEditingIndex].id : null;
        const response = await fetch(`http://localhost:3000/tasks/${editId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            description: description,
            status: "pending",
            deadline:deadline,
            importance: importance,
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
        } else {
          console.error("Failed to update todo:", response.status);
          // setError("Failed to update todo");
        }
      } else {
        // Creating a new todo
        console.log("creating");
        console.log("title",title);
        // console.log("currentTitle",currentTitle);
        const createdTodo = await fetch("http://localhost:3000/tasks"
        ,{
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title:title,
            description:description,
            status: "pending",
            deadline: deadline,
            importance:importance,
          }),
        });
        if(createdTodo.ok){
          const data = await createdTodo.json();
          // Adding the newly created todo to the state
          const currentTodos = todos ? [...todos] : [];
          const newTodos = [...currentTodos,data];
          setTodos(newTodos);
        }
        else{
            const errorDetails = await createdTodo.text();
            console.log(errorDetails);
            console.error("Failed to create todo:", createdTodo.status, errorDetails);
        } 
      }
      // Resetting the form
      console.log("after creating and reseting");
      setTitle("");
      setDescription("");
      setImportance("high");
      setDeadline(defaultDate);
      // setError(" ");
      setShowInputForm(false);
      console.log(description);
      console.log(title);
    } 
    catch (error) {
      console.log(error);
      console.error("Failed to save todo", error);
      // setError("Failed to save todo");
    }
  };
  useEffect(() => {
    console.log("Title updated:", title);
  }, [title]);
  
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
      } else {
        console.error("Failed to fetch tasks:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, []);

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
                      {/* {error && <p className="error">Title already exists</p>} */}
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
                      // disabled={!!error}
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
