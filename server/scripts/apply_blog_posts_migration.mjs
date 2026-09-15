import pg from "pg";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = `
    alter table public.blog_posts
      add column if not exists display_order integer not null default 0;

    create index if not exists blog_posts_order_idx on public.blog_posts (is_published, display_order);
  `;

  try {
    await pool.query(sql);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();