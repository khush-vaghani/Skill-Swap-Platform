const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

async function testDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'skill_swap_db'
    });

    console.log('✅ Successfully connected to MySQL database!');
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Users in database: ${rows[0].count}`);
    
    // Test skills query
    const [skills] = await connection.execute('SELECT COUNT(*) as count FROM skills');
    console.log(`📊 Skills in database: ${skills[0].count}`);
    
    await connection.end();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure XAMPP MySQL is running');
    console.log('2. Check if database "skill_swap_db" exists');
    console.log('3. Verify MySQL is running on port 3306');
  }
}

testDatabase(); 