# Team066-Practice2.5

More Detail to be added

## Prerequisites

- Python 3.8 or higher
- Node.js 14.x or higher
- MySQL 8.0 or higher

## Getting Started

### Backend Setup

1. Create and activate a virtual environment:

```bash
python3 -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`
```

2. Install dependencies:

```bash
cd BirdSpotter_Backend
pip install -r requirements.txt
pip install -e .
```

3. Configure database:

- Copy `db_config.json.example` to `db_config.json`
- Update database configuration in `db_config.json`

4. Start the Flask server:

```bash
flask --app bird_spotter --debug run --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install dependencies:

```bash
cd BirdSpotter_Frontend
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Demo Accounts

For testing purposes, you can use these demo accounts:

- Username: Maria Ingram / Password: hZTwmjV6DFDwEm
- Username: Jacob Johnson / Password: 9LwiFfP2oXF

## License

This project is licensed under the MIT License - see the LICENSE file for details.
