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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth" element={<OAuth />} />
        <Route path="/inventories" element={<Inventories />} />
        <Route path="/inventories/new" element={<CreateInventory />} />
        <Route path="/inventories/:id" element={<Inventory />} />
        <Route path="/inventories/:id/new-item" element={<CreateItem />} />
        <Route path="/items/:id" element={<Item />} />
        <Route path="/inventories/:id/settings" element={<InventorySettings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes></>
  );
}

export default App;