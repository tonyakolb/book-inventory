import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import api from "../api/axios";

export default function CreateItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customId, setCustomId] = useState("");
  const [form, setForm] = useState<ItemForm>({});
  const [inventory, setInventory] = useState<any>(null);

  type ItemForm = {
    customString1?: string;
    customBool1?: boolean;
    customInt1?: number;
  };

  useEffect(() => {
    api.get(`/inventories/${id}`)
      .then(res => setInventory(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/items", {
      inventoryId: Number(id),
      customId,
      ...form,
    });

    navigate(`/inventories/${id}`);
  };

  if (!inventory) return <Loader />

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>Create Item</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Custom ID</label>
          <input
            className="form-control"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            required
          />
        </div>

        {inventory.customString1State && (
          <div className="mb-3">
            <label className="form-label">
              {inventory.customString1Name}
            </label>
            <input
              className="form-control"
              value={form.customString1 || ""}
              onChange={e =>
                setForm({ ...form, customString1: e.target.value })
              }
            />
          </div>
        )}

        {inventory.customInt1State && (
          <div className="mb-3">
            <label className="form-label">
              {inventory.customInt1Name}
            </label>
            <input
              className="form-control"
              value={form.customInt1 || ""}
              onChange={e =>
                setForm({ ...form, customInt1: Number(e.target.value) })
              }
            />
          </div>
        )}

        {inventory.customBool1State && (
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={form.customBool1 || false}
              onChange={e =>
                setForm({ ...form, customBool1: e.target.checked })
              }
            />
            <label className="form-check-label">
              {inventory.customBool1Name}
            </label>
          </div>
        )}

        <button className="btn btn-dark">Create</button>
      </form>
    </div>
  );
}