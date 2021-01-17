FROM python:3.7
RUN pip install --index-url https://support.bayesfusion.com/pysmile-A/ pysmile \
  && pip install Flask \
  && pip install flask-cors \
  && pip install dataclasses-json
WORKDIR /app
ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0
COPY . .
EXPOSE 5000
CMD ["flask", "run"]
