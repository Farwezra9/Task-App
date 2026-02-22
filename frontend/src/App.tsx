import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import TodosPage from "./pages/user/TodosPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
          <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/todos" element={<TodosPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;