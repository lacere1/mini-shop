import * as jwt from 'jsonwebtoken';
export function requireUser(header?: string){
  if(!header) throw new Error('Unauthorized');
  const [t, tok] = header.split(' ');
  if(t!=='Bearer' || !tok) throw new Error('Unauthorized');
  return jwt.verify(tok, process.env.JWT_SECRET || 'supersecret') as any;
}
