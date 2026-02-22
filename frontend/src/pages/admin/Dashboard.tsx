import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    name: "",
    role: "",
  });

  useEffect(() => {
    const email = localStorage.getItem("email") || "";
    const name = localStorage.getItem("name") || "";
    const role = localStorage.getItem("role") || "";

    setUser({ email, name, role });
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");       
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Anda berhasil login.</p>

      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.name}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <button onClick={handleLogout}>Logout</button>
      <button 
        onClick={() => navigate("/users")} 
        style={{ marginLeft: "10px" }}
      >
        Kelola Users
      </button>
    </div>
  );
}

export default Dashboard;
