import * as jwt from 'jsonwebtoken';
export function verifyAuth(header?: string){
  if(!header) return null;
  const [type, token] = header.split(' ');
  if(type !== 'Bearer' || !token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as any; } catch { return null; }
}
