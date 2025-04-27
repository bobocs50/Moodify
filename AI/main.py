from transformers import pipeline
from collections import defaultdict
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify

#Get the model path from the environment variable
load_dotenv()
model_path = os.getenv("HUGGINGFACE_MODEL_PATH")

# Setup
app = Flask(__name__)
classifier = pipeline("text-classification", model=model_path, return_all_scores=True)



@app.route('/startAi', methods=['POST'])
def get_mood():

    #Get the json data from the request
    data = request.get_json()
    answers = data.get("answers", [])

    print("Answers received:", answers)
    


     #extract json and put into answers list
  
    


    #Dict with each label and its score
    scores_total = defaultdict(float)
    scores_avg_normalized = defaultdict(float)


    # Sum the scores for each label
    for answer in answers:
        result = classifier(answer)[0]
        
        print(result)
        for item in result:
            #Add to scores_total dict
            scores_total[item['label']] += item['score']
            

    # Calculate the number of answers (for averaging)
    total_score = sum(scores_total.values())

    

    # Calculate the average score for each label
    for mood, score in scores_total.items():
        average_score = score / total_score
        #Add to the score_avg dict
        scores_avg_normalized[mood] = round(average_score,2)
     


    print("\nAverage scores for each label:", scores_avg_normalized)
    return jsonify(scores_avg_normalized)




