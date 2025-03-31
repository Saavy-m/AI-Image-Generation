import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./pages/PrivateRoute";
import ImageGenerator from "./pages/ImageGenerator";
import ListImages from "./pages/ListImages";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
        }
         />
        <Route path="/imagegenerator" element={<ImageGenerator />} />
        <Route path="/list" element={<ListImages />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
