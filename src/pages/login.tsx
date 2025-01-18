import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import TodoInput from "../Components/card-input";
import { AuthContext } from "../context/authcontext";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setToken} = useContext(AuthContext)

  const navigate = useNavigate()
  
  const handleLogin = async ()=>{
    try {
      console.log("Hello");
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, password
        }),
      });
      if(!response.ok){
        throw new Error("Login Failed");
      }
      else{

        const data = await response.json();
        if(data.token)
          {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            navigate("/todo");
          }
        }
    }
    catch(err){
      console.log("error:",err);
    }
  } 
  return (
    <>
      <TodoInput
        value={username}
        name="username"
        placeholder="Enter Username"
        onChange={setUsername}
        required={false}
      />
      <TodoInput
        value={password}
        name="username"
        placeholder="Enter Password"
        onChange={setPassword}
        required={false}
      />
      <div className="action-buttons">
        <button
          type="button"
          onClick={handleLogin}
          className="btn cancel"
        >
          Login
        </button>
          <NavLink to="/register">Go to Register</NavLink>
      </div>
    </>
  );
}
