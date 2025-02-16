const API_URL = 'http://localhost:3000/api';

export async function fetchDashboardData() {
  const response = await fetch(`${API_URL}/dashboard`);
  return response.json();
}

export async function fetchClientes() {
  const response = await fetch(`${API_URL}/clientes`);
  return response.json();
}

export async function fetchDocumentos() {
  const response = await fetch(`${API_URL}/documentos`);
  return response.json();
}
