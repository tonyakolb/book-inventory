import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateInventory() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [customString1State, setCustomString1State] = useState(false);
  const [customString1Name, setCustomString1Name] = useState("");

  const [customInt1State, setCustomInt1State] = useState(false);
  const [customInt1Name, setCustomInt1Name] = useState("");

  const [customBool1State, setCustomBool1State] = useState(false);
  const [customBool1Name, setCustomBool1Name] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await api.post("/inventories", {
      title,
      description,
      customString1State,
      customString1Name,
      customInt1State,
      customInt1Name,
      customBool1State,
      customBool1Name,
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

        <hr />
        <h4>Custom Fields</h4>

        <div className="mb-3">
          <input
            type="checkbox"
            checked={customString1State}
            onChange={(e) => setCustomString1State(e.target.checked)}
          /> Enable String Field

          {customString1State && (
            <input
              className="form-control mt-2"
              placeholder="Field name"
              value={customString1Name}
              onChange={(e) => setCustomString1Name(e.target.value)}
            />
          )}
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            checked={customInt1State}
            onChange={(e) => setCustomInt1State(e.target.checked)}
          /> Enable Number Field

          {customInt1State && (
            <input
              className="form-control mt-2"
              placeholder="Field name"
              value={customInt1Name}
              onChange={(e) => setCustomInt1Name(e.target.value)}
            />
          )}
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            checked={customBool1State}
            onChange={(e) => setCustomBool1State(e.target.checked)}
          /> Enable Checkbox Field

          {customBool1State && (
            <input
              className="form-control mt-2"
              placeholder="Field name"
              value={customBool1Name}
              onChange={(e) => setCustomBool1Name(e.target.value)}
            />
          )}
        </div>

        <button className="btn btn-dark">Create</button>
      </form>
    </div>
  );
}