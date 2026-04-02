async function f(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON, but: ' + contentType);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error parsing JSON file:', error);
      throw error;
    }
  }
  