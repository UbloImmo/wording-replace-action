FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt && python -m spacy download fr_core_news_sm

COPY . .

EXPOSE 8000

CMD [ "fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000" ]
