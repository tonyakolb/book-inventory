import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

type InventoryType = {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  version: number;

  customString1Name?: string | null;
  customString1State?: boolean;

  customInt1Name?: string | null;
  customInt1State?: boolean;

  customBool1Name?: string | null;
  customBool1State?: boolean;
};

export default function InventorySettings() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<InventoryType | null>(null);
  const [accessList, setAccessList] = useState<any[]>([]);
  const [newUserId, setNewUserId] = useState("");

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const res = await api.get(`/inventories/${id}`);
    setForm(res.data);
    const accessRes = await api.get(`/inventories/${id}/access`);
    setAccessList(accessRes.data);
  };

  if (!form) return <div className="container mt-4">Loading...</div>;

  const handleSave = async () => {
    try {
      const res = await api.put(`/inventories/${id}`, form);
      setForm(res.data);
      alert("Saved successfully");
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("Conflict detected. Reloading latest version...");
        load();
      } else {
        alert("Error saving inventory");
      }
    }
  };

  const handleAddAccess = async () => {
    if (!newUserId) return;

    try {
      await api.post(`/inventories/${id}/access`, {
        userId: Number(newUserId)
      });

      setNewUserId("");
      load();
    } catch {
      alert("Error adding access");
    }
  };

  const handleRemoveAccess = async (userId: number) => {
    await api.delete(`/inventories/${id}/access/${userId}`);
    load();
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h2>Inventory Settings</h2>

      {/* Basic Info */}
      <div className="mb-3">
        <label>Title</label>
        <input
          className="form-control"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label>Description</label>
        <textarea
          className="form-control"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <div className="form-check mb-4">
        <input
          type="checkbox"
          className="form-check-input"
          checked={form.isPublic}
          onChange={(e) =>
            setForm({ ...form, isPublic: e.target.checked })
          }
        />
        <label className="form-check-label">
          Public inventory
        </label>
      </div>

      <hr />

      <h4>Custom Fields</h4>

      {/* String 1 */}
      <div className="mb-3">
        <input
          type="checkbox"
          checked={form.customString1State || false}
          onChange={(e) =>
            setForm({
              ...form,
              customString1State: e.target.checked
            })
          }
        />{" "}
        Enable String Field
        {form.customString1State && (
          <input
            className="form-control mt-2"
            placeholder="Field name"
            value={form.customString1Name || ""}
            onChange={(e) =>
              setForm({
                ...form,
                customString1Name: e.target.value
              })
            }
          />
        )}
      </div>

      {/* Int 1 */}
      <div className="mb-3">
        <input
          type="checkbox"
          checked={form.customInt1State || false}
          onChange={(e) =>
            setForm({
              ...form,
              customInt1State: e.target.checked
            })
          }
        />{" "}
        Enable Number Field
        {form.customInt1State && (
          <input
            className="form-control mt-2"
            placeholder="Field name"
            value={form.customInt1Name || ""}
            onChange={(e) =>
              setForm({
                ...form,
                customInt1Name: e.target.value
              })
            }
          />
        )}
      </div>

      {/* Bool 1 */}
      <div className="mb-4">
        <input
          type="checkbox"
          checked={form.customBool1State || false}
          onChange={(e) =>
            setForm({
              ...form,
              customBool1State: e.target.checked
            })
          }
        />{" "}
        Enable Checkbox Field
        {form.customBool1State && (
          <input
            className="form-control mt-2"
            placeholder="Field name"
            value={form.customBool1Name || ""}
            onChange={(e) =>
              setForm({
                ...form,
                customBool1Name: e.target.value
              })
            }
          />
        )}
      </div>

      <hr />

      <h4>Access Control</h4>

      {!form.isPublic && (
        <>
          <div className="mb-3 d-flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="User ID"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
            />
            <button className="btn btn-dark" onClick={handleAddAccess}>
              Add
            </button>
          </div>

          <ul className="list-group mb-3">
            {accessList.map((a) => (
              <li
                key={a.user.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {a.user.name} ({a.user.email})
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveAccess(a.user.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {form.isPublic && (
        <div className="text-muted mb-3">
          Inventory is public — all authenticated users can write.
        </div>
      )}

      <button className="btn btn-dark me-2" onClick={handleSave}>
        Save
      </button>

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}