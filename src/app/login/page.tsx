'use client';

import { useForm } from 'react-hook-form';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setError('');
      const response = await login(data);
      localStorage.setItem('token', response.access); // Guardar el token en localStorage
      router.push('/landing'); // Redirigir a la landing page
    } catch (e: any) {
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email">Correo Electrónico</label>
            <input {...register('email')} className="w-full border p-2 rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Contraseña</label>
            <input {...register('password')} type="password" className="w-full border p-2 rounded" />
          </div>
          <button className="w-full bg-indigo-500 text-white py-2 rounded">Iniciar Sesión</button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
