import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import OAuth from "./pages/OAuth";
import Navbar from "./components/Navbar";
import Inventory from "./pages/Inventory";
import Inventories from "./pages/Inventories";
import CreateInventory from "./pages/CreateInventory";
import CreateItem from "./pages/CreateItem";
import Item from "./pages/Item";
import InventorySettings from "./pages/InventorySettings";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth" element={<OAuth />} />
        <Route path="/inventories" element={<PrivateRoute><Inventories /></PrivateRoute>} />
        <Route path="/inventories/new" element={<PrivateRoute><CreateInventory /></PrivateRoute>} />
        <Route path="/inventories/:id" element={<PrivateRoute><Inventory /></PrivateRoute>} />
        <Route path="/inventories/:id/new-item" element={<PrivateRoute><CreateItem /></PrivateRoute>} />
        <Route path="/items/:id" element={<PrivateRoute><Item /></PrivateRoute>} />
        <Route path="/inventories/:id/settings" element={<PrivateRoute><InventorySettings /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes></>
  );
}

export default App;