import { useNavigate } from 'react-router-dom';

import { useState } from 'react';



export default function Login() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');



  const handleLogin = async (e) => {

    e.preventDefault();

    setIsLoading(true);

    setError('');



    try {

      const res = await fetch('http://localhost:5000/api/auth/login', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({ email, password }),

      });



      const data = await res.json();



      if (!res.ok) {

        setError(data.msg || 'Login failed');

        setIsLoading(false);

        return;

      }



      // Store token in localStorage

      localStorage.setItem('token', data.token);



      // Navigate to dashboard

      navigate('/dashboard');

    } catch (err) {

      setError('Something went wrong. Please try again.');

    } finally {

      setIsLoading(false);

    }

  };



  const handleSignUp = () => {

    navigate('/register');

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">

        <h1 className="text-2xl font-bold text-center mb-6">FinMate</h1>



        <form onSubmit={handleLogin} className="space-y-4">

          <div>

            <label className="block text-sm font-medium mb-1">Email</label>

            <input

              type="email"

              placeholder="Enter Email"

              className="w-full p-2 border rounded"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              disabled={isLoading}

              required

            />

          </div>



          <div>

            <label className="block text-sm font-medium mb-1">Password</label>

            <input

              type="password"

              placeholder="Enter Password"

              className="w-full p-2 border rounded"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              disabled={isLoading}

              required

            />

          </div>



          {error && <p className="text-red-500 text-sm">{error}</p>}



          <button

            type="submit"

            disabled={isLoading}

            className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${

              isLoading ? 'opacity-70 cursor-not-allowed' : ''

            }`}

          >

            {isLoading ? 'Signing in...' : 'Sign in'}

          </button>

        </form>



        <p className="mt-4 text-center text-sm text-gray-500">

          Don't have an account?{' '}

          <button

            onClick={handleSignUp}

            className="text-blue-600 hover:underline font-medium"

          >

            Sign Up

          </button>

        </p>

      </div>

    </div>

  );

}

