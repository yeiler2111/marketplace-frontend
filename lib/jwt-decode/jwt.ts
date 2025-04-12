import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

class JwtService {
  isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (err) {
      console.error("Token inválido", err);
      return false;
    }
  }

  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }

  getUserData(token: string): any | null {
    try {
      return this.decodeToken(token);
    } catch {
      return null;
    }
  }
}

const jwtService = new JwtService();
export default jwtService;
