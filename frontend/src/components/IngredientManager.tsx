import { useEffect, useState } from "react";
import axios from "axios";

export default function IngredientManager({ title, type } : any) {
  const token = localStorage.getItem("admin_token");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [threshold, setThreshold] = useState("");
  const [price, setPrice] = useState("");

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/ingredient/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchItems();
    };
    fetch();
  }, []);

  const addItem = async () => {
    if (!name || !price) return alert("Name & price required");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/ingredient/add`,
        { type, name, stock, threshold, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      setStock("");
      setThreshold("");
      setPrice("");

      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStock = async (id :string, value : string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/ingredient/stock/${type}/${id}`,
        { stock: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePrice = async (id : string, value : string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/ingredient/price/${type}/${id}`,
        { price: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id : string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/ingredient/${type}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">

      <h1 className="text-2xl font-semibold mb-6 text-gray-100">{title}</h1>

      {/* ADD FORM */}
      <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-3 text-gray-100">Add New {title}</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            type="number"
            placeholder="Threshold"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-gray-100"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </div>

        <button
          onClick={addItem}
          className="mt-4 bg-blue-700 text-gray-100 px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
        <h2 className="text-lg font-medium mb-3 text-gray-100">All {title}</h2>

        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-300">No items found.</p>
        ) : (
          <table className="w-full text-left border border-gray-600">
            <thead>
              <tr className="border-b border-gray-600 bg-gray-700">
                <th className="p-2 text-gray-100">Name</th>
                <th className="p-2 text-gray-100">Price</th>
                <th className="p-2 text-gray-100">Stock</th>
                <th className="p-2 text-gray-100">Threshold</th>
                <th className="p-2 text-center text-gray-100">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item : any) => (
                <tr key={item._id} className="border-b border-gray-600">
                  <td className="p-2 text-gray-100">{item.name}</td>

                  <td className="p-2">
                    <input
                      type="number"
                      defaultValue={item.price}
                      onBlur={(e) => updatePrice(item._id, e.target.value)}
                      className="p-1 border border-gray-600 rounded w-20 bg-gray-700 text-gray-100"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="number"
                      defaultValue={item.stock}
                      onBlur={(e) => updateStock(item._id, e.target.value)}
                      className="p-1 border border-gray-600 rounded w-20 bg-gray-700 text-gray-100"
                    />
                  </td>

                  <td className="p-2 text-gray-100">{item.threshold}</td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="px-3 py-1 bg-red-700 text-gray-100 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
