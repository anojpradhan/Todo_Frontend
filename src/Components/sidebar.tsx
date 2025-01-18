import { User } from "lucide-react";
import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/authcontext";
import { useContext } from "react";
interface SidebarProps{
  onAddButtonClick : ()=>void;
}
const Sidebar = (props:SidebarProps) => {
  const navigate= useNavigate();
  const {setToken}= useContext(AuthContext);
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    setToken("");
    // Navigate to the login page
    navigate("/login");
  };
  return (
    <>
      <div className="sidebar">
    <header><h1>Todo App</h1></header>
        <div className="profile">
          <div className="icons">
            <User></User>
          </div>
          <h3>Person_Name</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="sidebar-items-container">
          <div onClick={props.onAddButtonClick} className="sidebar-items">
          <h5>Add Task</h5>
          <div className="icons">
            <Plus></Plus>
          </div>
          </div>
          <div className="sidebar-items">
          <h5>Search Task</h5>
          <div className="icons">
            <Search></Search>
          </div>
          </div>
        </div>
        </div>
    </>
  );
};

export default Sidebar;
