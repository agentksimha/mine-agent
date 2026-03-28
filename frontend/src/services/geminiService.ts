export async function getChatResponse(message: string, history: { role: string; parts: { text: string }[] }[]) {
  try {
    const response = await fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error querying backend:', error);
    return 'Error: Unable to connect to the Mine Agent backend.';
  }
}
