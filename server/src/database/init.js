const db = require('./db');

// Удаляем существующую таблицу player_of_month
db.run('DROP TABLE IF EXISTS player_of_month', (err) => {
  if (err) {
    console.error('Error dropping player_of_month table:', err);
  } else {
    console.log('player_of_month table dropped successfully');
    
    // Создаем таблицу player_of_month заново
    db.run(`
      CREATE TABLE player_of_month (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        role TEXT NOT NULL,
        image TEXT,
        kills INTEGER,
        headshots INTEGER,
        rating REAL,
        mvp INTEGER,
        game TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating player_of_month table:', err);
      } else {
        console.log('player_of_month table created successfully');
        
        // Добавляем тестовую запись для CS2
        const now = new Date().toISOString();
        db.run(`
          INSERT INTO player_of_month (
            name, team, role, image, kills, headshots, rating, mvp, game, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          's1mple',
          'Natus Vincere',
          'AWPer',
          '/uploads/players/s1mple.jpg',
          250,
          65,
          1.35,
          3,
          'cs2',
          now,
          now
        ], (err) => {
          if (err) {
            console.error('Error inserting test player:', err);
          } else {
            console.log('Test player inserted successfully');
          }
        });
      }
    });
  }
}); 