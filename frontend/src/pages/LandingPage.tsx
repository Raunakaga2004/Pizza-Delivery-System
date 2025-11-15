import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-100">🍕 Pizza Paradise</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-300">
          Fresh, hot, and delicious pizzas delivered straight to your door.
          Customize your perfect pie or choose from our menu!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gray-700 text-gray-100 font-semibold rounded-lg hover:bg-gray-600 transition"
          >
            Order Now
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-transparent border-2 border-gray-500 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 hover:text-gray-100 transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-100">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-700 p-6 rounded-lg">
              <div className="text-6xl mb-4">🍅</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-100">Fresh Ingredients</h3>
              <p className="text-lg text-gray-300">We use only the freshest ingredients to make your pizza taste amazing.</p>
            </div>
            <div className="text-center bg-gray-700 p-6 rounded-lg">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-100">Fast Delivery</h3>
              <p className="text-lg text-gray-300">Hot and fresh pizzas delivered to your doorstep in under 30 minutes.</p>
            </div>
            <div className="text-center bg-gray-700 p-6 rounded-lg">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-100">Custom Pizzas</h3>
              <p className="text-lg text-gray-300">Create your own pizza with our wide variety of toppings and bases.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 bg-gray-900 text-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of satisfied customers and enjoy the best pizza in town!</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-blue-800 text-gray-100 font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2023 Pizza Paradise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
