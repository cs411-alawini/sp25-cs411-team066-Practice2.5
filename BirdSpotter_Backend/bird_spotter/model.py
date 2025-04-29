import mysql.connector
from mysql.connector import pooling
import flask
import bird_spotter
import json
import os

# Read database configuration from db_config.json
config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db_config.json')
with open(config_path, 'r') as f:
    config = json.load(f)
    dbconfig = config['database']

# Create a connection pool
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    **dbconfig
)

def init_trigger(connection):
     cursor = connection.cursor()
 
     check_trigger_sql = """
         SELECT TRIGGER_NAME
         FROM information_schema.TRIGGERS
         WHERE TRIGGER_SCHEMA = DATABASE()
           AND TRIGGER_NAME = 'check_event_coordinates';
     """
     cursor.execute(check_trigger_sql)
     result = cursor.fetchone()
 
     if not result:
         create_trigger_sql = """
         CREATE TRIGGER check_event_coordinates
         BEFORE INSERT ON Event
         FOR EACH ROW
         BEGIN
             IF NEW.latitude < -90 OR NEW.latitude > 90
                OR NEW.longitude < -180 OR NEW.longitude > 180 THEN
                 SIGNAL SQLSTATE '45000'
                     SET MESSAGE_TEXT = 'Invalid latitude or longitude value.';
             END IF;
         END;
         """
         cursor.execute(create_trigger_sql)
         connection.commit()
         print("[Database Init] Created trigger: check_event_coordinates")
     else:
         print("[Database Init] Trigger already exists: check_event_coordinates")
 
     cursor.close()

def get_db():
    """Get a connection from the pool."""
    if 'db' not in flask.g:
        flask.g.db = connection_pool.get_connection()
        print("Got connection from pool")
        
        # Create the search procedure if it doesn't exist
        cursor = flask.g.db.cursor()
        create_search_procedure(cursor)
        cursor.close()

    return flask.g.db


@bird_spotter.app.teardown_appcontext
def close_db(error):
    """Return the connection to the pool."""
    db = flask.g.pop('db', None)
    if db is not None:
        db.close()
        print("Returned connection to pool")


def get_random_birds(num, connection):
    cursor = connection.cursor()
    query = """SELECT * FROM Bird
    ORDER BY RAND()
    LIMIT %s
    """
    cursor.execute(query, (num,))
    results = cursor.fetchall()
    results = [
        {"bird_scientific_name": result[0],
         "bird_common_name": result[1],
         "bird_description": result[2]} for result in results
    ]
    cursor.close()
    return results


def get_bird_by_sci_name(bird_sci_name, connection):
    cursor = connection.cursor()
    query = """SELECT * FROM Bird
    WHERE bird_scientific_name = %s"""
    cursor.execute(query, (bird_sci_name,))
    result = cursor.fetchall()
    if len(result) == 0:
        return {}
    result = result[0]
    result = {"bird_scientific_name": result[0],
              "bird_common_name": result[1],
              "bird_description": result[2]}
    cursor.close()
    return result


def get_bird_by_com_name(bird_com_name, connection):
    cursor = connection.cursor()
    query = """SELECT * FROM Bird
    WHERE bird_common_name = %s"""
    cursor.execute(query, (bird_com_name,))
    result = cursor.fetchall()
    if len(result) == 0:
        return {}
    result = result[0]
    result = {"bird_scientific_name": result[0],
              "bird_common_name": result[1],
              "bird_description": result[2]}
    cursor.close()
    return result


def create_search_procedure(cursor):
    procedure = """
    CREATE PROCEDURE IF NOT EXISTS search_birds(IN search_text VARCHAR(255))
    BEGIN
        IF search_text = 'default' THEN
            -- Advanced query 1: Get random birds with their event counts
            WITH BirdEvents AS (
                SELECT 
                    B.bird_scientific_name,
                    B.bird_common_name,
                    B.bird_description,
                    COUNT(E.event_id) as event_count
                FROM Bird B
                LEFT JOIN Event E ON B.bird_scientific_name = E.bird_scientific_name
                GROUP BY B.bird_scientific_name, B.bird_common_name, B.bird_description
            )
            SELECT 
                bird_scientific_name,
                bird_common_name,
                bird_description
            FROM BirdEvents
            ORDER BY RAND()
            LIMIT 10;
        ELSE
            -- Advanced query 2: Search by scientific or common name with related birds
            WITH BirdSearch AS (
                SELECT bird_scientific_name
                FROM Bird
                WHERE bird_scientific_name = search_text
                UNION
                SELECT bird_scientific_name
                FROM Bird
                WHERE bird_common_name = search_text
            ),
            RelatedBirds AS (
                SELECT DISTINCT B2.bird_scientific_name
                FROM Bird B1
                JOIN Event E1 ON B1.bird_scientific_name = E1.bird_scientific_name
                JOIN Event E2 ON E1.user_id = E2.user_id
                JOIN Bird B2 ON E2.bird_scientific_name = B2.bird_scientific_name
                WHERE B1.bird_scientific_name IN (SELECT bird_scientific_name FROM BirdSearch)
                AND B2.bird_scientific_name NOT IN (SELECT bird_scientific_name FROM BirdSearch)
            )
            SELECT 
                B.bird_scientific_name,
                B.bird_common_name,
                B.bird_description
            FROM Bird B
            WHERE B.bird_scientific_name IN (SELECT bird_scientific_name FROM BirdSearch)
            LIMIT 1;
        END IF;
    END;
    """
    cursor.execute(procedure)
