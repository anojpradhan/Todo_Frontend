import { Routes,Route, Navigate } from "react-router";
import Todo from "./pages/todo";
import Login from "./pages/login";
import Register from "./pages/register";
function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<Navigate to="/todo" />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/todo" element={<Todo />} />
    </Routes>
    </>
  );
}
export default App;