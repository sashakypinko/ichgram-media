import lightKiteServer from 'light-kite';
import {connectDB} from './src/core/config/db';

import 'dotenv/config';
import modules from './src/modules';

connectDB();

const app = lightKiteServer(modules);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.run(PORT, () => {
  console.log(`Media Service running on port ${PORT}`);
});
