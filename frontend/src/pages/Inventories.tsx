import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type Inventory = {
    id: number;
    title: string;
    description: string;
    creatorId: number;
};

export default function Inventories() {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadInventories();
    }, []);

    const loadInventories = async () => {
        const res = await api.get("/inventories");
        setInventories(res.data);
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Inventories</h2>
                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/inventories/new")}
                >
                    Create Inventory
                </button>
            </div>
            
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {inventories.map((inv) => (
                        <tr
                            key={inv.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/inventories/${inv.id}`)}
                        >
                            <td>{inv.id}</td>
                            <td>{inv.title}</td>
                            <td>{inv.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}