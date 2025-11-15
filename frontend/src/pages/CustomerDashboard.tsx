import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



interface Pizza {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface CartItem {
  pizza: Pizza;
  quantity: number;
}

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const api = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("customer_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const loadPizzas = async () => {
      try {
        const res = await axios.get(`${api}/customer/order`, { headers });
        setPizzas(res.data.pizzas || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadPizzas();
  }, []);

  // Add to cart (local state)
  const addToCart = (pizza: Pizza) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.pizza._id === pizza._id);

      if (existing) {
        return prev.map((item) =>
          item.pizza._id === pizza._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { pizza, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (pizzaId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.pizza._id === pizzaId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Place Order (final call)
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        pizzaId: item.pizza._id,
        quantity: item.quantity,
      })),
    };

    try {
      await axios.post(
        `${api}/customer/order/place`,
        payload,
        { headers }
      );

      alert("Order placed!");
      setCart([]);

    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-semibold mb-6 text-gray-100">Customer Dashboard</h1>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/customer/create-pizza")}
          className="px-4 py-2 bg-blue-700 text-gray-100 rounded-lg hover:bg-blue-600 transition"
        >
          Create Custom Pizza
        </button>

        <button
          onClick={() => window.scrollTo(0, document.body.scrollHeight)}
          className="px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition"
        >
          🛒 View Cart
        </button>
      </div>

      {/* Pizza List */}
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Available Pizzas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pizzas.map((p) => (
          <div key={p._id} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
            <h3 className="text-lg font-medium text-gray-100">{p.title}</h3>
            <p className="text-gray-300 mb-2">{p.description}</p>
            <p className="font-medium text-gray-100">₹{p.price}</p>

            <button
              onClick={() => addToCart(p)}
              className="mt-3 w-full py-2 bg-green-700 text-gray-100 rounded-lg hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART SECTION */}
      <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-300">Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.pizza._id}
                className="flex justify-between items-center border border-gray-600 p-3 rounded mb-3 bg-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-100">{item.pizza.title}</p>
                  <p className="text-sm text-gray-400">
                    ₹{item.pizza.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-gray-600 text-gray-100 rounded hover:bg-gray-500 transition"
                    onClick={() => updateQuantity(item.pizza._id, -1)}
                  >
                    -
                  </button>

                  <span className="text-gray-100">{item.quantity}</span>

                  <button
                    className="px-3 py-1 bg-gray-600 text-gray-100 rounded hover:bg-gray-500 transition"
                    onClick={() => updateQuantity(item.pizza._id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-gray-700 p-4 rounded mt-4 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-100">
                Total: ₹
                {cart.reduce(
                  (acc, curr) => acc + curr.pizza.price * curr.quantity,
                  0
                )}
              </h3>
            </div>

            <button
              onClick={placeOrder}
              className="mt-6 w-full py-2 bg-orange-700 text-gray-100 rounded-lg hover:bg-orange-600 transition"
            >
              Place Order
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/customer/orders")}
          className="mt-4 px-4 py-2 bg-purple-700 text-gray-100 rounded-lg hover:bg-purple-600 transition"
        >
          📦 My Orders
        </button>
      </div>
    </div>
  );
}
