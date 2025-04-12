export class LocalStorageService {
    setItem<T>(key: string, value: T): void {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (err) {
        console.error("Error saving to localStorage", err);
      }
    }
  
    getItem<T>(key: string): T | null {
      try {
        const serializedValue = localStorage.getItem(key);
        if (!serializedValue) return null;
        return JSON.parse(serializedValue) as T;
      } catch (err) {
        console.error("Error reading from localStorage", err);
        return null;
      }
    }
  
    removeItem(key: string): void {
      localStorage.removeItem(key);
    }
  
    clear(): void {
      localStorage.clear();
    }
  }
  
  const localStorageService = new LocalStorageService();
  export default localStorageService;
  