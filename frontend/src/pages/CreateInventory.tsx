import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateInventory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await api.post("/inventories", {
      title,
      description,
    });

    navigate(`/inventories/${res.data.id}`);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>Create Inventory</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button className="btn btn-dark">Create</button>
      </form>
    </div>
  );
}