import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chainsight.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'viewer'
        );
        CREATE TABLE IF NOT EXISTS shipments (
            id TEXT PRIMARY KEY,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            status TEXT DEFAULT 'On Schedule',
            eta TEXT NOT NULL,
            carrier TEXT NOT NULL,
            sla TEXT NOT NULL
        );
    """)
    # Seed data
    users = conn.execute("SELECT COUNT(*) as count FROM users").fetchone()
    if users["count"] == 0:
        # NOTE: Using plaintext password for demo purposes only
        conn.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')")
    
    ships = conn.execute("SELECT COUNT(*) as count FROM shipments").fetchone()
    if ships["count"] == 0:
        conn.executescript("""
            INSERT INTO shipments (id, origin, destination, status, eta, carrier, sla) VALUES
            ('SO-4521', 'Shanghai Port, CN', 'Long Beach, CA', 'On Schedule', 'Jun 12', 'Maersk', '$18,500'),
            ('SO-4522', 'Shenzhen, CN', 'Rotterdam, NL', 'In Transit', 'Jun 15', 'MSC', 'Nominal'),
            ('SO-4523', 'Kaohsiung, TW', 'Los Angeles, CA', 'On Schedule', 'Jun 14', 'Evergreen', '$6,200'),
            ('SO-4524', 'Busan, KR', 'Seattle, WA', 'On Schedule', 'Jun 11', 'Hapag-Lloyd', 'Nominal'),
            ('SO-4525', 'Singapore, SG', 'Hamburg, DE', 'On Schedule', 'Jun 18', 'CMA CGM', 'Nominal'),
            ('SO-4526', 'Hong Kong, HK', 'Savannah, GA', 'In Transit', 'Jun 20', 'COSCO', 'Nominal');
        """)
    conn.commit()
    conn.close()
