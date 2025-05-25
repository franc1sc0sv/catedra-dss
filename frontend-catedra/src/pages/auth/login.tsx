import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { CustomError } from "../../interfaces/error.interface";
import { redirectInBaseOfRole } from "../../utils/redirect";

function HeaderLogin() {
  return (
    <div className="bg-blue-100 rounded-t-xl px-8 pt-8 pb-2 text-center">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-1">
        ACOEMPRENDEDORES
      </h1>
      <p className="text-gray-600 text-base">Sistema de Gestión Financiera</p>
    </div>
  );
}

function ForgotPassword() {
  return (
    <div className="text-center mt-4">
      <a href="#" className="text-gray-500 text-sm hover:underline">
        ¿Olvidó su contraseña?
      </a>
    </div>
  );
}

function LoginForm({
  onSubmit,
  username,
  setUsername,
  password,
  setPassword,
  error,
}: {
  onSubmit: (e: React.FormEvent) => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
        Iniciar Sesión
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="usuario">
          Usuario
        </label>
        <input
          id="usuario"
          type="text"
          name="username"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
          placeholder="Ingrese su nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1" htmlFor="contrasena">
          Contraseña
        </label>
        <input
          id="contrasena"
          type="password"
          name="password"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white bg-blue-700 hover:bg-blue-800 font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        >
          Ingresar
        </button>
      </div>
    </form>
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      navigate(redirectInBaseOfRole({ role: user.role }), { replace: true });
    } catch (e: unknown) {
      if (e instanceof CustomError) {
        setError(e.message);
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-full max-w-md">
        <HeaderLogin />
        <div className="bg-white rounded-b-xl px-8 py-8 shadow-lg">
          <LoginForm
            onSubmit={handleSubmit}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            error={error}
          />
          <ForgotPassword />
        </div>
      </div>
    </div>
  );
}
