import { useEffect, useState } from "react";
import API from "../../api/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    role: "user",
    status: "aktif",
  });
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengambil data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (edit) {
        await API.put(`/users/${form.id}`, form);
      } else {
        await API.post("/users", form);
      }
      setForm({ id: 0, name: "", email: "", role: "user", status: "aktif" });
      setEdit(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan user");
    }
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setEdit(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-5">
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 mr-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 mr-2"
        />
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 mr-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 mr-2">
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {edit ? "Update" : "Tambah"}
        </button>
      </form>


      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.name}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.role}</td>
              <td className="border px-2 py-1">{u.status}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white p-1 rounded"
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
