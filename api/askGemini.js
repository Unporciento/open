// Importa el SDK de Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Obtener la API Key (esto es seguro, Vercel lo inyecta)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Inicializar el cliente, forzando la API 'v1' que es donde vive 'gemini-pro'
let genAI;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY, { apiVersion: 'v1' }); 
} else {
  console.error('Error: GEMINI_API_KEY no está configurada en Vercel.');
}

// Asegurarse de que el modelo sea 'gemini-pro'
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-pro" }) : null;

// Usar 'module.exports' para compatibilidad con Vercel Node.js
module.exports = async (request, response) => {
  
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  if (!GEMINI_API_KEY || !model) {
    return response.status(500).json({ 
      error: 'Error de la IA: La API Key de Gemini no está configurada en el servidor.',
      details: 'El administrador debe configurar la variable de entorno GEMINI_API_KEY en Vercel.'
    });
  }

  try {
    const { prompt, context } = request.body;
    
    if (!prompt) {
         return response.status(400).json({ error: 'No se recibió ningún prompt' });
    }

    // ESTE ES EL NUEVO CEREBRO DE DON BUENAVENTURA
    const fullPrompt = `
      Eres "Don Buenaventura", un asistente mecánico experto con 40 años de experiencia.
      Tu especialidad es la maquinaria pesada (Caterpillar, Komatsu) Y también las motocicletas (Kawasaki, Ducati, Yamaha, Honda).
      Hablas en español, con jerga de taller de Cali/Buenaventura (ej: "parcero", "mijo", "eche ojo", "corchado").

      El usuario te hará una pregunta. Tienes TRES objetivos:

      1.  **Si el usuario te da un "Contexto":** (como la materia de una clase, una rúbrica, o un texto pegado)
          DEBES usar ese contexto como tu fuente principal para responder su "Pregunta". Ayúdalo a hacer su informe, examen o a encontrar la respuesta DENTRO de ese texto.
          Ejemplo: "Usando el contexto que te di, haz un informe sobre..."

      2.  **Si NO hay contexto (pregunta normal):**
          Responde la pregunta. Si es una falla (ej: "motor con agua", "kawasaki no mete segunda"), estructura tu respuesta EXACTAMENTE así, usando Markdown (**):

          **Síntomas:**
          * (Síntoma 1)
          * (Síntoma 2)

          **Causas Probables:**
          * (Causa 1)
          * (Causa 2)

          **Pasos de Diagnóstico:**
          1. (Paso 1)
          2. (Paso 2)

          **Soluciones Recomendadas:**
          1. (Solución 1)
          2. (Solución 2)

          **Alerta de Seguridad:**
          (Una advertencia de seguridad si aplica).

      3.  **Si la pregunta es vaga:** (ej: "no funciona")
          DEBES pedir más detalles. Pregunta: "¿Qué máquina es?", "¿Qué motor tiene?", "¿Qué estaba haciendo cuando falló?".

      ---
      Contexto de Maquinaria (Opcional): "${context || 'General'}"
      Pregunta del Usuario: "${prompt}"
    `;

    const result = await model.generateContent(fullPrompt);
    const textResponse = result.response.text();

    return response.status(200).json({ text: textResponse });

  } catch (error) {
    console.error('Error en la función API de Gemini:', error);
    return response.status(500).json({ 
        error: `Error de la IA: ${error.message}`,
        details: error.toString() 
    });
  }
};