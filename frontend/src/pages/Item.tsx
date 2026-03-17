import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import api from "../api/axios";

type ItemType = {
  id: number;
  inventoryId: number;
  customId: string;
  customString1?: string;
  customInt1?: number | null;
  customBool1?: boolean | null;
  version: number;
};

export default function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [customString1, setCustomString1] = useState("");
  const [customInt1, setCustomInt1] = useState<number | null>(null);
  const [customBool1, setCustomBool1] = useState(false);
  const [inventory, setInventory] = useState<any>(null);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    const res = await api.get<ItemType>(`/items/${id}`);
    const itemData = res.data;

    setItem(itemData);
    setCustomString1(itemData.customString1 || "");
    setCustomInt1(itemData.customInt1 ?? null);
    setCustomBool1(itemData.customBool1 ?? false);

    const inv = await api.get(`/inventories/${itemData.inventoryId}`);
    setInventory(inv.data);
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/items/${id}`, {
        customId: item.customId,
        customString1,
        customInt1,
        customBool1,
        version: item.version
      });

      setItem(res.data);
      toast.success("Item saved");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.warning("Conflict detected, reloading...");
        load();
      } else {
        toast.error("Error saving item");
      }
    }
  };

  if (!item || !inventory)
    return <Loader />

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2>Edit Item</h2>

      <div className="mb-3">
        <label>Custom ID</label>
        <input className="form-control" value={item.customId} disabled />
      </div>

      {inventory.customString1State && (
        <div className="mb-3">
          <label>{inventory.customString1Name}</label>
          <input
            className="form-control"
            value={customString1}
            onChange={(e) => setCustomString1(e.target.value)}
          />
        </div>
      )}

      {inventory.customInt1State && (
        <div className="mb-3">
          <label>{inventory.customInt1Name}</label>
          <input
            type="number"
            className="form-control"
            value={customInt1 ?? ""}
            onChange={(e) =>
              setCustomInt1(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      )}

      {inventory.customBool1State && (
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={customBool1}
            onChange={(e) => setCustomBool1(e.target.checked)}
          />
          <label className="form-check-label">
            {inventory.customBool1Name}
          </label>
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