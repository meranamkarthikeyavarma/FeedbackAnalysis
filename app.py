from flask import Flask, request, send_file
from flask_cors import CORS
import io
import pandas as pd
from transformers import pipeline
import seaborn as sns
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

classifier = pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment')

@app.route('/feedbackfile', methods=['POST'])
def feedbackfile():
    # Get the uploaded file
    file = request.files['file']

    # Process the CSV file
    stream = io.StringIO(file.stream.read().decode('utf-8'))
    real_df = pd.read_csv(stream)

    cols = list(real_df.columns)
    req_cols = [col for col in cols if col.endswith('Feedback')]
    req_df = real_df[req_cols]

    num_columns = len(req_df.columns)
    colors = ['#2C3531', '#116466', '#D9B08C']

    fig, axes = plt.subplots(nrows=num_columns, ncols=2, figsize=(8, 4 * num_columns))
    axes = axes.flatten()

    for index, col in enumerate(req_df.columns):
        texts = req_df[col].tolist()
        results = classifier(texts, return_all_scores=True)

        positives, neutrals, negatives = 0, 0, 0
        for i, text in enumerate(texts):
            total_score = sum(result['score'] for result in results[i])
            percentages = {result['label']: (result['score'] / total_score) * 100 for result in results[i]}
            positives += percentages.get('LABEL_2', 0)
            neutrals += percentages.get('LABEL_1', 0)
            negatives += percentages.get('LABEL_0', 0)

        sentiment_values = [positives, neutrals, negatives]
        sentiment_labels = ['Positive', 'Neutral', 'Negative']

        sns.barplot(x=sentiment_labels, y=sentiment_values, ax=axes[index * 2], palette=colors)
        axes[index * 2].set_title(f'Bar chart Analysis - {col}')
        axes[index * 2 + 1].pie(sentiment_values, labels=sentiment_labels, autopct='%1.1f%%', colors=colors)
        axes[index * 2 + 1].set_title(f'Pie Chart Analysis - {col}')

    plt.suptitle("Comprehensive Report on Feedback Insights")
    img = io.BytesIO()
    plt.tight_layout()
    plt.subplots_adjust(top=0.9, hspace=0.5)
    plt.savefig(img, format='png')
    img.seek(0)

    return send_file(img, mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
