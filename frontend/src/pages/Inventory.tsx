import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import api from "../api/axios";

type InventoryType = {
  id: number;
  title: string;
  description: string;

  creator: {
    id: number;
    name: string;
  };

  customString1State: boolean;
  customString1Name: string | null;

  customInt1State: boolean;
  customInt1Name: string | null;

  customBool1State: boolean;
  customBool1Name: string | null;
};

export default function Inventory() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryType | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadInventory();
    loadItems();
    loadComments();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadComments();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const loadInventory = async () => {
    const res = await api.get(`/inventories/${id}`);
    setInventory(res.data);
  };

  const loadItems = async () => {
    const res = await api.get(`/items?inventoryId=${id}`);
    setItems(res.data);
  }

  const handleDelete = async () => {
    await Promise.all(
      selected.map(id => api.delete(`/items/${id}`))
    );
    setSelected([]);
    loadItems();
  };

  const loadComments = async () => {
    const res = await api.get(`/comments/inventory/${id}`);
    setComments(res.data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await api.post(`/comments/inventory/${id}`, {
      content: newComment
    });

    setNewComment("");
    loadComments();
  };

  const handleLike = async (itemId: number) => {
    try {
      const res = await api.post(`/likes/${itemId}`);

      if (res.data.message === "Liked") {
        toast.success("Liked");
      } else {
        toast.info("Unliked");
      }

      loadItems();
    } catch (err) {
      console.log(err);
    }
  };

  if (!inventory) return <Loader />;

  return (
    <div className="container mt-4">
      <h2>{inventory.title}</h2>
      <p className="text-muted">{inventory.description}</p>
      {user?.id === inventory.creator.id && (
        < button
          className="btn btn-danger mb-3"
          onClick={async () => {
            if (!confirm("Delete this inventory?")) return;

            try {
              await api.delete(`/inventories/${id}`);
              navigate("/inventories");
            } catch {
              toast.error("Error deleting inventory");
            }
          }}
        >
          Delete Inventory
        </button>)
      }

      <hr />

      <h4>Items</h4>

      <button
        className="btn btn-dark mb-3"
        onClick={() => navigate(`/inventories/${id}/new-item`)}
      >
        Add Item
      </button>

      {user?.id === inventory.creator.id && (
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(`/inventories/${id}/settings`)}
        >
          Settings
        </button>
      )}

      <button
        className="btn btn-danger mb-3"
        disabled={!selected.length}
        onClick={handleDelete}
      >
        Delete Selected
      </button>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === items.length && items.length > 0}
                onChange={(e) =>
                  setSelected(
                    e.target.checked ? items.map((i) => i.id) : []
                  )
                }
              />
            </th>
            <th>ID</th>
            <th>Custom ID</th>
            {inventory?.customString1State && (
              <td>{inventory.customString1Name}</td>
            )}
            {inventory?.customInt1State && (
              <td>{inventory.customInt1Name}</td>
            )}
            {inventory?.customBool1State && (
              <td>{inventory.customBool1Name}</td>
            )}
            <th>Created By</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, item.id]
                        : selected.filter((id) => id !== item.id)
                    )
                  }
                />
              </td>
              <td>{item.id}</td>
              <td
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate(`/items/${item.id}`)}
              >
                {item.customId}
              </td>
              {inventory?.customString1State && (
                <td>{item.customString1}</td>
              )}

              {inventory?.customInt1State && (
                <td>{item.customInt1}</td>
              )}

              {inventory?.customBool1State && (
                <td>{item.customBool1 ? "Yes" : "No"}</td>
              )}
              <td>User #{item.createdById}</td>
              <td>{item._count?.likes ?? 0}</td>

              <td>
                <button
                  className={`btn btn-sm ${item.likes?.length ? "btn-danger" : "btn-outline-dark"
                    }`}
                  onClick={() => handleLike(item.id)}
                >
                  {item.likes?.length ? "Unlike" : "Like"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h4>Discussion</h4>

      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </div>

      <button
        className="btn btn-dark mb-4"
        onClick={handleAddComment}
      >
        Add Comment
      </button>

      <div>
        {comments.map((c) => (
          <div key={c.id} className="border p-2 mb-2 rounded">
            <strong>{c.user?.name}</strong>
            <div>{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}