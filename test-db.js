require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  try {
    console.log('RDS PostgreSQL 연결 시도 중...');
    await client.connect();
    console.log('✅ RDS PostgreSQL 연결 성공!');
    
    // 테이블 목록 확인
    const result = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';');
    console.log('📋 기존 테이블 목록:', result.rows);
    
    await client.end();
  } catch (error) {
    console.error('❌ RDS 연결 실패:', error.message);
  }
}

testConnection();
