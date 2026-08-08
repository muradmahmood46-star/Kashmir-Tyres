import postgres from 'postgres'
import fs from 'fs'

const connectionString = 'postgresql://postgres:murad00966!@db.sqljemistpnlncpyeqxx.supabase.co:5432/postgres'
const sql = postgres(connectionString)

async function main() {
  try {
    console.log('Reading fix-rls.sql...')
    const query = fs.readFileSync('fix-rls.sql', 'utf8')
    console.log('Executing SQL against Supabase...')
    await sql.unsafe(query)
    console.log('Successfully updated Row Level Security policies!')
  } catch (error) {
    console.error('Failed to execute SQL:', error)
  } finally {
    await sql.end()
  }
}

main()
