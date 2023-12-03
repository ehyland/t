import { Express } from 'express';

export function startServer({
  server,
  port,
  name,
}: {
  server: Express;
  port: number;
  name: string;
}) {
  server.listen(port, () => console.log(`🚀 ${name} http://localhost:${port}`));
}
