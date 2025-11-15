import { useEffect, useState } from "react";
import axios from "axios";

interface Pizza {
  _id: string;
  title: string;
  price: number;
}

interface OrderItem {
  pizza: Pizza;
  quantity: number;
}

interface Order {
  _id: string;
  orders: OrderItem[];
  status: string;
  totalprice: number;
  createdAt: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const api = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("customer_token");

  const headers = { Authorization: `Bearer ${token}` };

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${api}/customer/order/orders`, { headers });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadOrders();
    };
    load();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-semibold mb-6 text-gray-100">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-300">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-100">
                Order #{order._id.slice(-6)}
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Status: <span className="font-medium text-gray-100">{order.status}</span>
              </p>

              <div className="space-y-2">
                {order.orders.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-gray-600 py-2"
                  >
                    <span className="text-gray-100">
                      {item.pizza.title} × {item.quantity}
                    </span>
                    <span className="text-gray-100">₹{item.pizza.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-lg font-semibold text-gray-100">
                Total: ₹{order.totalprice}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
