import sqlite3


def init_database():
    connection = sqlite3.connect('database.db')

    with open('schema.sql', 'w') as f:
        f.write("""
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            description TEXT
        );
        """)

    with open('schema.sql', 'r') as f:
        connection.executescript(f.read())

    connection.commit()
    connection.close()
    print("Baza danych została zainicjalizowana pomyślnie!")


if __name__ == '__main__':
    init_database()