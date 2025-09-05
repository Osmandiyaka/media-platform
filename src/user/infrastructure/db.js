import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const _dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(_dirname, 'bin', 'user.db.json')
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [] });

await db.read();

export default db;

