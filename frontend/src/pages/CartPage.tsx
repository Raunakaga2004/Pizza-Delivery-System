import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("customer_token");

  const headers = { Authorization: `Bearer ${token}` };

  // Load cart (Order Recieved)
  const loadCart = async () => {
    try {
      const res = await axios.get(`${api}/customer/order/orders`, { headers });

      const activeCart = res.data.orders?.find(
        (o: Order) => o.status === "Order Recieved"
      );

      setCart(activeCart || null);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await loadCart();
    };
    load();
  }, []);

  // Update quantity
  const updateQuantity = async (pizzaId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `${api}/customer/order/update`,
        { pizzaId, quantity },
        { headers }
      );
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item (set quantity = 0)
  const removeItem = async (pizzaId: string) => {
    try {
      await axios.put(
        `${api}/customer/order/update`,
        { pizzaId, quantity: 0 }, // Backend will handle removing
        { headers }
      );
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      await axios.post(`${api}/customer/order/place`, {}, { headers });

      alert("Order placed successfully!");

      navigate("/customer/orders");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 bg-gray-900 min-h-screen text-gray-300">Loading cart...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-100">Your Cart</h1>

      {!cart || cart.orders.length === 0 ? (
        <div>
          <p className="text-gray-300">Your cart is empty.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-700 text-gray-100 rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/customer/dashboard")}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {/* List items */}
          {cart.orders.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow border border-gray-700"
            >
              <div>
                <p className="font-medium text-gray-100">{item.pizza.title}</p>
                <p className="text-sm text-gray-400">
                  ₹{item.pizza.price} × {item.quantity}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 transition"
                  onClick={() =>
                    updateQuantity(item.pizza._id, item.quantity - 1)
                  }
                >
                  -
                </button>

                <span className="px-3 text-gray-100">{item.quantity}</span>

                <button
                  className="px-3 py-1 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 transition"
                  onClick={() =>
                    updateQuantity(item.pizza._id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  className="ml-4 px-3 py-1 bg-red-700 text-gray-100 rounded hover:bg-red-600 transition"
                  onClick={() => removeItem(item.pizza._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-gray-100">Summary</h2>
            <p className="text-xl font-bold text-gray-100">Total: ₹{cart.totalprice}</p>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            className="w-full py-2 bg-orange-700 text-gray-100 rounded-lg hover:bg-orange-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
