from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

PLANTNET_API_KEY = "2b10fDhkGyu9QTZBAR5suUg8Ae"

@app.route('/', methods=['GET'])
def serve_app():
    return send_from_directory('.', 'crop-disease-detector.html')

@app.route('/identify', methods=['POST', 'OPTIONS'])
def identify_plant():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    if not latitude or not longitude:
        return jsonify({"error": "Missing location parameters"}), 400

    image = request.files['image']
    
    try:
        files = {'images': (image.filename, image.stream, image.mimetype)}
        
        # API key goes in the URL, other parameters in the data payload
        api_url = f"https://my-api.plantnet.org/v2/identify/all?api-key={PLANTNET_API_KEY}"
        
        data = {
            'include-related-images': 'true',
            'no-reject': 'false',
            'lang': 'en',
            'latitude': latitude,
            'longitude': longitude
        }
        
        response = requests.post(api_url, data=data, files=files)
        response.raise_for_status()

        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        error_message = str(e)
        if e.response is not None:
            error_message = f"Error from PlantNet API: {e.response.status_code} - {e.response.text}"
        return jsonify({"error": error_message}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)