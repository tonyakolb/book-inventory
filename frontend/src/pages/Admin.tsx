import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type UserType = {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
};

export default function Admin() {
    const [users, setUsers] = useState<UserType[]>([]);
    const navigate = useNavigate();

    const checkAccess = async () => {
        try {
            const res = await api.get("/auth/me");
            console.log("ME:", res.data);

            if (res.data.role !== "ADMIN") {
                console.log("NOT ADMIN");
                navigate("/");
                return;
            }

            console.log("IS ADMIN");
            load();
        } catch (err) {
            console.log("ERROR:", err);
            navigate("/login");
        }
    };

    const load = async () => {
        const res = await api.get("/admin/users");
        setUsers(res.data);
    };

    const toggleRole = async (id: number) => {
        await api.patch(`/admin/users/${id}/role`);
        load();
    };

    const deleteUser = async (id: number) => {
        if (!confirm("Delete this user?")) return;
        await api.delete(`/admin/users/${id}`);
        load();
    };

    useEffect(() => {
        checkAccess();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Admin Panel</h2>

            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ width: 200 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={
                                    user.role === "ADMIN"
                                        ? "badge bg-danger"
                                        : "badge bg-secondary"
                                }>
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => toggleRole(user.id)}
                                >
                                    Toggle Role
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}