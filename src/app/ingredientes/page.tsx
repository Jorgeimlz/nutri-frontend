'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ENDPOINTS } from '@/lib/apiEndpoints';

const IngredientesPage = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<number[]>([]);
  const [recetas, setRecetas] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [recetaModalData, setRecetaModalData] = useState<any>(null); // Modal de detalles de recetas
  const [razonesNoApta, setRazonesNoApta] = useState<string[]>([]); // Modal de razones no aptas
  const router = useRouter();

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const response = await fetch(ENDPOINTS.INGREDIENTES.LIST);
        const data = await response.json();
        setIngredientes(data);
      } catch (e) {
        setError('Error al cargar los ingredientes.');
      }
    };

    fetchIngredientes();
  }, []);

  const toggleIngrediente = (id: number) => {
    setSelectedIngredientes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fetchRecetas = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token
      if (!token) {
        setError('Usuario no autenticado.');
        return;
      }

      const response = await fetch(ENDPOINTS.RECETAS.RECOMENDACIONES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Agregar el token en la cabecera
        },
        body: JSON.stringify({ ingredientes: selectedIngredientes }),
      });

      if (!response.ok) {
        throw new Error('Error al cargar las recetas.');
      }

      const data = await response.json();
      setRecetas(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar las recetas.');
    }
  };

  const fetchRecetaDetails = async (id: number) => {
    try {
      const response = await fetch(ENDPOINTS.RECETAS.DETAILS(id));
      if (!response.ok) {
        throw new Error('Error al cargar los detalles de la receta.');
      }
      const data = await response.json();
      setRecetaModalData(data); // Almacenar los detalles en el estado del modal
    } catch (e: any) {
      setError(e.message || 'Error al cargar los detalles de la receta.');
    }
  };

  const showRazonesNoApta = (razones: string[]) => {
    setRazonesNoApta(razones); // Mostrar razones en el modal
  };

  const closeRecetaModal = () => {
    setRecetaModalData(null);
  };

  const closeRazonesModal = () => {
    setRazonesNoApta([]);
  };

  const viewRecetaNutricional = () => {
    router.push('/recetas/nutricionales');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Selecciona tus Ingredientes</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          {ingredientes.map((ingrediente: any) => (
            <div
              key={ingrediente.id}
              className={`p-4 border rounded-md ${
                selectedIngredientes.includes(ingrediente.id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-50 border-gray-300'
              }`}
              onClick={() => toggleIngrediente(ingrediente.id)}
            >
              <h2 className="font-semibold">{ingrediente.nombre}</h2>
            </div>
          ))}
        </div>
        <button
          onClick={fetchRecetas}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Ver Recetas Recomendadas
        </button>
      </div>

      {/* Sección de Recetas */}
      {recetas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recetas Recomendadas</h2>
          {recetas.map((receta) => (
            <div
              key={receta.id}
              className="p-4 border rounded-lg bg-white shadow-sm mb-4"
            >
              <h3 className="font-semibold text-lg">{receta.receta}</h3>
              <p>
                Ingredientes disponibles: <b>{receta.ingredientes_disponibles.join(', ')}</b>
              </p>
              <p>
                Ingredientes faltantes: <b>{receta.ingredientes_faltantes.join(', ')}</b>
              </p>
              {receta.es_apta ? (
                <p className="text-green-500 font-bold mt-2">
                  Esta receta es apta para ti.
                </p>
              ) : (
                <>
                  <p className="text-red-500 font-bold mt-2">
                    Debido a tus preferencias alimenticias, no te recomendamos esta receta.
                  </p>
                  <button
                    onClick={() => showRazonesNoApta(receta.razones_no_apta)}
                    className="mt-2 text-blue-500 underline"
                  >
                    ¿Por qué no te recomendamos esta receta?
                  </button>
                </>
              )}
              <button
                onClick={() => fetchRecetaDetails(receta.id)}
                className="mt-2 text-blue-500 underline"
              >
                Ver detalles
              </button>
            </div>
          ))}
          <button
            onClick={viewRecetaNutricional}
            className="w-full mt-4 bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600"
          >
            Ver recetas para mi estilo de vida
          </button>
        </div>
      )}

      {/* Modal para detalles de la receta */}
      {recetaModalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{recetaModalData.nombre}</h2>
            <p>{recetaModalData.descripcion}</p>
            <ul className="mt-4">
              <li><b>Tiempo de preparación:</b> {recetaModalData.tiempo_preparacion} minutos</li>
              <li><b>Porciones:</b> {recetaModalData.porciones}</li>
              <li>
                <b>Valores Nutricionales:</b>
                <ul className="list-disc pl-6">
                  <li>Calorías: {recetaModalData.valores_nutricionales.calorias}</li>
                  <li>Proteínas: {recetaModalData.valores_nutricionales.proteinas} g</li>
                  <li>Carbohidratos: {recetaModalData.valores_nutricionales.carbohidratos} g</li>
                  <li>Grasas: {recetaModalData.valores_nutricionales.grasas} g</li>
                </ul>
              </li>
            </ul>
            <button
              onClick={closeRecetaModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para razones no aptas */}
      {razonesNoApta.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Razones por las que no es apta</h2>
            <ul className="list-disc pl-6">
              {razonesNoApta.map((razon, index) => (
                <li key={index}>{razon}</li>
              ))}
            </ul>
            <button
              onClick={closeRazonesModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientesPage;
