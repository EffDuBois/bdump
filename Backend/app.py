from flask import Flask, request
from googleChain import llmOutput

app = Flask(__name__)

@app.route("/",methods=['GET'])
def home():
    return llmOutput(request.json["content"])
    
if __name__ == "__main__":
    app.run(debug=True)