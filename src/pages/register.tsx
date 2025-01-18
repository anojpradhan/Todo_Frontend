import { useContext, useState } from "react";
import TodoInput from "../Components/card-input";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/authcontext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const {setToken}= useContext(AuthContext);
  
  const handleRegister= async ()=>{
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,email,phone,password
        }),
      });
      if(!response.ok){
        throw new Error("Login Failed");
      }
      else{
        console.log("Hello");
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
        placeholder="Enter Full Name"
        onChange={setUsername}
        required={false}
      />
      <TodoInput
        value={email}
        name="email"
        placeholder="Enter Email"
        onChange={setEmail}
        required={false}
      />
      <TodoInput
        value={phone}
        name="phone"
        placeholder="Enter Mobile Number"
        onChange={setPhone}
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
          onClick={handleRegister}
          className="btn cancel"
        >
          Register
        </button>
      </div>
    </>
  );
}
