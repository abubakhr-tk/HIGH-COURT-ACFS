import app from './app';
import { config } from 'dotenv';

config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
    console.log(`Kano Case Filing API listening on http://localhost:${port}`);
});
