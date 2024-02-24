    

    
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins= "http://localhost:5173")  

# Sample grid data (replace with your actual grid data structure)
grid_data = []

@app.route('/api/save', methods=['POST'])
def save_grid():
    if request.method == 'OPTIONS':
        # Respond to preflight request
        response = jsonify({'message': 'Preflight request accepted'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    else:
        # Handle saving data here
        global grid_data
        data = request.json
        grid_data = data.get('grid')
        # Create a response with CORS headers
        response = jsonify({'message': 'Grid saved successfully'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        return response

@app.route('/api/load', methods=['GET', 'OPTIONS'])
def load_grid():
    global grid_data
    return jsonify({'grid': grid_data})




if __name__ == '__main__':
    app.run(debug=True)