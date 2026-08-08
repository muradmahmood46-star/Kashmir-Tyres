import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

const run = async () => {
  const client = new Client({
    user: 'postgres',
    password: 'murad00966!',
    host: 'db.sqljemistpnlncpyeqxx.supabase.co',
    port: 5432,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to database.');
    
    const sql = fs.readFileSync('supabase-schema.sql', 'utf8');
    await client.query(sql);
    
    console.log('Schema executed successfully!');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
};

run();
