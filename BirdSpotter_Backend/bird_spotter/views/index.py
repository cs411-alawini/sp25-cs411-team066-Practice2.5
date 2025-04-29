"""
Bird Spotter index (main) view.

URLs include:
/
"""
import bird_spotter.model
import flask
import bird_spotter
from flask import request, redirect, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import uuid
import os


@bird_spotter.app.route('/')
def show_index():
    """Display / route."""
    return flask.render_template("index.html")


@bird_spotter.app.route('/api/search', methods=['GET'])
def search():
    text = flask.request.args.get('text', default='abc', type=str)
    connection = bird_spotter.model.get_db()
    cursor = connection.cursor()
    print(text)
    
    try:
        cursor.execute("CALL search_birds(%s)", (text,))
        results = cursor.fetchall()
        
        # Need to fetch all result sets to avoid "Commands out of sync" error
        while cursor.nextset():
            pass
        
        if not results:
            return flask.jsonify({'status': 'error', 'message': 'Not Found'}), 404
        
        # Format the results
        if text == 'default':
            response = {
                'status': 'success',
                'data': [{
                    'bird_scientific_name': result[0],
                    'bird_common_name': result[1],
                    'bird_description': result[2]
                } for result in results]
            }
        else:
            response = {
                'status': 'success',
                'data': [{
                    'bird_scientific_name': results[0][0],
                    'bird_common_name': results[0][1],
                    'bird_description': results[0][2]
                }]
            }
        
        return flask.jsonify(response), 200
    finally:
        cursor.close()


@bird_spotter.app.route('/api/images/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image_folder = flask.current_app.config["UPLOAD_FOLDER"]
    allowed_exts = flask.current_app.config.get("ALLOWED_EXTENSIONS", ['.jpg'])
    
    for ext in allowed_exts:
        filename = f"{image_id}{ext}"
        file_path = os.path.join(image_folder, filename)
        if os.path.exists(file_path):
            return send_from_directory(image_folder, filename)
    
    return jsonify({"message": "Image not found"}), 404

@bird_spotter.app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    connection = bird_spotter.model.get_db()
    cursor = connection.cursor()

    try:
        delete_event_query = "DELETE FROM Event WHERE event_id = %s"
        cursor.execute(delete_event_query, (event_id,))

        if cursor.rowcount == 0:
            cursor.close()
            return flask.jsonify({
                "status": "error",
                "message": f"Event with id {event_id} not found."
            }), 404

        connection.commit()
        cursor.close()

        return flask.jsonify({
            "status": "success",
            "message": f"Event {event_id} deleted successfully."
        }), 200

    except Exception as e:
        print(f"Delete event error: {str(e)}")
        if 'connection' in locals() and 'cursor' in locals():
            connection.rollback()
            cursor.close()
        return flask.jsonify({
            "status": "error",
            "message": "An error occurred while deleting the event."
        }), 500


@bird_spotter.app.route('/api/events', methods=['GET'])
def get_events():
    connection = bird_spotter.model.get_db()
    cursor = connection.cursor()

    search = flask.request.args.get('search', default=None, type=str)

    base_query = """
        SELECT 
            E.event_id,
            E.user_id,
            E.event_time,
            E.longitude,
            E.latitude,
            E.Country,
            E.State,
            B.bird_common_name,
            B.bird_scientific_name,
            I.image_id
        FROM Event E
        JOIN Bird B ON E.bird_scientific_name = B.bird_scientific_name
        LEFT JOIN Image I ON E.event_id = I.event_id
    """

    if search:
        base_query += " WHERE B.bird_scientific_name LIKE %s"
        cursor.execute(base_query, (f'%{search}%',))
    else:
        return "bird name not provided", 500

    results = cursor.fetchall()
    events = []
    for row in results:
        image_id = row[9]
        image_url = f"/api/images/{image_id}" if image_id else ""

        events.append({
            "event_id": row[0],
            "user_id": row[1],
            "event_time": row[2].isoformat(),
            "longitude": float(row[3]),
            "latitude": float(row[4]),
            "Country": row[5],
            "State": row[6],
            "bird_name": row[7],
            "bird_scientific_name": row[8],
            "image_url": image_url
        })

    cursor.close()
    return flask.jsonify({"status": "success", "data": events}), 200

@bird_spotter.app.route('/api/user_events', methods=['GET'])
def get_user_events():
    connection = bird_spotter.model.get_db()
    cursor = connection.cursor()

    user_id = flask.request.args.get('user_id', default=None, type=int)
    print(f"Received request for user_events with user_id: {user_id}")

    base_query = """
        SELECT 
            E.event_id,
            E.user_id,
            E.event_time,
            E.longitude,
            E.latitude,
            E.Country,
            E.State,
            B.bird_common_name,
            B.bird_scientific_name,
            I.image_id
        FROM Event E
        JOIN Bird B ON E.bird_scientific_name = B.bird_scientific_name
        LEFT JOIN Image I ON E.event_id = I.event_id
    """

    if user_id is not None:
        base_query += " WHERE E.user_id = %s"
        cursor.execute(base_query, (user_id,))
        print(f"Executing query for user_id {user_id}")
    else:
        cursor.close()
        print("No user_id provided in request")
        return flask.jsonify({
            "status": "error",
            "message": "user_id not provided"
        }), 400

    results = cursor.fetchall()
    print(f"Found {len(results)} events for user_id {user_id}")
    
    events = []
    for row in results:
        image_id = row[9]
        image_url = f"/api/images/{image_id}" if image_id else ""

        events.append({
            "event_id": row[0],
            "user_id": row[1],
            "event_time": row[2].isoformat(),
            "longitude": float(row[3]),
            "latitude": float(row[4]),
            "Country": row[5],
            "State": row[6],
            "bird_name": row[7],
            "bird_scientific_name": row[8],
            "image_url": image_url
        })

    cursor.close()
    return flask.jsonify({
        "status": "success",
        "data": events
    }), 200

@bird_spotter.app.route('/api/events/page', methods=['GET'])
def get_events_paginated():
    connection = bird_spotter.model.get_db()
    cursor = connection.cursor()

    page = flask.request.args.get('page', default=1, type=int)
    page=max(page,1)
    limit = flask.request.args.get('limit', default=10, type=int)
    sort = flask.request.args.get('sort', default="event_time:desc", type=str)

    offset = (page - 1) * limit

    main_query = f"""
        SELECT 
            E.event_id,
            E.user_id,
            E.event_time,
            E.longitude,
            E.latitude,
            E.Country,
            E.State,
            B.bird_common_name,
            B.bird_scientific_name,
            I.image_id
        FROM Event E
        JOIN Bird B ON E.bird_scientific_name = B.bird_scientific_name
        LEFT JOIN Image I ON E.event_id = I.event_id
        ORDER BY E.event_time DESC
        LIMIT %s OFFSET %s
    """
    cursor.execute(main_query, (limit, offset))
    results = cursor.fetchall()

    events = []
    for row in results:
        image_id = row[9]
        image_url = f"/api/images/{image_id}" if image_id else ""
        events.append({
            "event_id": row[0],
            "user_id": row[1],
            "event_time": row[2].isoformat(),
            "longitude": float(row[3]),
            "latitude": float(row[4]),
            "country": row[5],
            "state": row[6],
            "bird_name": row[7],
            "bird_scientific_name": row[8],
            "image_url": image_url
        })

    cursor.execute("SELECT COUNT(*) FROM Event")
    total_items = cursor.fetchone()[0]
    total_pages = (total_items + limit - 1) // limit

    cursor.close()

    return flask.jsonify({
        "status": "success",
        "data": {
            "events": events,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_items": total_items,
                "has_next": page < total_pages
            }
        }
    }), 200


@bird_spotter.app.route("/api/upload", methods=["POST"])
def upload_bird_sighting():
    connection = bird_spotter.model.get_db()
    with connection.cursor() as cursor:
        cursor.execute("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ")
    bird_spotter.model.init_trigger(connection)

    try:
        bird_name = flask.request.form.get('bird_scientific_name')
        latitude = flask.request.form.get('latitude')
        longitude = flask.request.form.get('longitude')
        country = flask.request.form.get('country')
        state = flask.request.form.get('state')
        user_id = flask.request.form.get('user_id')

        # Validate required fields including user_id
        if not all([bird_name, latitude, longitude, country, state, user_id]):
            return flask.jsonify({
                "status": "error",
                "message": "Missing required fields"
            }), 400

        # Validate user exists
        cursor = connection.cursor()

        cursor.execute("SELECT uid FROM User WHERE uid = %s", (user_id,))
        if not cursor.fetchone():
            cursor.close()
            return flask.jsonify({
                "status": "error",
                "message": "Invalid user ID"
            }), 401

        # Validate coordinates
        try:
            lat = float(latitude)
            lng = float(longitude)
            if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                return flask.jsonify({
                    "status": "error",
                    "message": "Invalid coordinates"
                }), 400
        except ValueError:
            return flask.jsonify({
                "status": "error",
                "message": "Invalid coordinate format"
            }), 400

        # Handle file upload
        print("getting image file")
        file = flask.request.files.get("file")
        if not file:
            return flask.jsonify({
                "status": "error",
                "message": "No file uploaded"
            }), 400

        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in flask.current_app.config["ALLOWED_EXTENSIONS"]:
            return flask.jsonify({
                "status": "error",
                "message": f"Unsupported file type. Allowed types: {', '.join(flask.current_app.config['ALLOWED_EXTENSIONS'])}"
            }), 400
        
        # Check if bird exists
        cursor.execute("SELECT bird_scientific_name FROM Bird WHERE bird_scientific_name = %s", (bird_name,))
        if not cursor.fetchone():
            cursor.close()
            return flask.jsonify({
                "status": "error",
                "message": f"Bird species '{bird_name}' not found in database"
            }), 400
        
        # Insert event
        insert_event = """INSERT INTO Event (user_id, event_time, longitude, latitude, Country, State, bird_scientific_name)
                        VALUES (%s, NOW(), %s, %s, %s, %s, %s)"""
        cursor.execute(insert_event, (user_id, longitude, latitude, country, state, bird_name))
        event_id = cursor.lastrowid

        # Insert image
        insert_image = """INSERT INTO Image (event_id, bird_scientific_name)
                        VALUES (%s, %s)"""
        cursor.execute(insert_image, (event_id, bird_name))
        image_id = cursor.lastrowid

        # Save file
        filename = secure_filename(f"{image_id}{ext}")
        image_folder = flask.current_app.config["UPLOAD_FOLDER"]
        os.makedirs(image_folder, exist_ok=True)
        image_path = os.path.join(image_folder, filename)
        file.save(image_path)

        query = """
            SELECT 
                B.bird_scientific_name,
                COUNT(DISTINCT E.event_id) AS event_count,
                COUNT(DISTINCT I.image_id) AS image_count
            FROM Bird B
            LEFT JOIN Event E ON B.bird_scientific_name = E.bird_scientific_name
            LEFT JOIN Image I ON E.event_id = I.event_id
            WHERE B.bird_scientific_name IN (
                SELECT bird_scientific_name
                FROM Bird
                WHERE bird_scientific_name = %s
            )
            GROUP BY B.bird_scientific_name
        """
        cursor.execute(query, (bird_name,))
        bird_info_row = cursor.fetchone()

        related_birds_query = """
            SELECT 
                B.bird_scientific_name,
                COUNT(DISTINCT E.event_id) AS event_count
            FROM Bird B
            LEFT JOIN Event E ON B.bird_scientific_name = E.bird_scientific_name
            WHERE B.bird_scientific_name IN (
                SELECT bird_scientific_name
                FROM Bird
                WHERE bird_scientific_name LIKE CONCAT('%', %s, '%')
            )
            GROUP BY B.bird_scientific_name
        """
        cursor.execute(related_birds_query, (bird_name,))
        related_birds_rows = cursor.fetchall()

        related_birds = [
            {"bird_scientific_name": row[0], "event_count": row[1]}
            for row in related_birds_rows
        ]

        bird_info = {
            "bird_scientific_name": bird_info_row[0],
            "event_count": bird_info_row[1],
            "image_count": bird_info_row[2],
            "related_birds": related_birds
        } if bird_info_row else {
            "bird_scientific_name": bird_name,
            "event_count": 0,
            "image_count": 0,
            "related_birds": related_birds
        }

        connection.commit()
        cursor.close()

        return flask.jsonify({
            "status": "success",
            "message": "Upload successful",
            "data": {
                "event_id": event_id,
                "image_id": image_id,
                "bird_info": bird_info
            }
        }), 200

    except Exception as e:
        print(f"Upload error: {str(e)}")
        if 'connection' in locals() and 'cursor' in locals():
            connection.rollback()
            cursor.close()
        return flask.jsonify({
            "status": "error",
            "message": "An error occurred while processing your request"
        }), 500


@bird_spotter.app.route('/api/v1/login/', methods=['POST'])
def login():
    connection = bird_spotter.model.get_db()
    cursor = connection.cursor()

    data = flask.request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return flask.jsonify({
            "status": "error",
            "message": "Username and password are required"
        }), 400

    username = data['username']
    password = data['password']

    query = """
        SELECT uid, user_name
        FROM User
        WHERE user_name = %s AND password = %s
    """
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    cursor.close()

    if user:
        response = {
            "status": "success",
            "message": "Login successful",
            "user": {
                "username": user[1],
                "user_id": user[0]
            }
        }
        return flask.jsonify(response), 200
    else:
        return flask.jsonify({
            "status": "error",
            "message": "Invalid username or password"
        }), 401