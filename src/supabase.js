import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_PROJECT') || supabaseKey.includes('YOUR_PUBLIC')) {
  console.error('❌ ERROR: Variables de Supabase no configuradas correctamente');
  console.error('Por favor, edita el archivo .env.local con tus credenciales reales:');
  console.error('1. VITE_SUPABASE_URL - URL de tu proyecto Supabase');
  console.error('2. VITE_SUPABASE_KEY - Clave pública (anon) de Supabase');
  console.error('');
  console.error('Instrucciones en SETUP.md');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;