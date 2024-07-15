from flask import Flask, jsonify, request
from googleChain import llmOutput
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000","https://edamone.netlify.app/"])

@app.route("/",methods=['POST'])
def home():
    res =llmOutput(request.json["content"])
    print(res)
    return jsonify(res)
    
if __name__ == "__main__":
    app.run(debug=True)