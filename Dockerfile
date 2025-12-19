# Gunakan Python 3.9 sebagai base
FROM python:3.9

# Set folder kerja
WORKDIR /code

# Copy requirements dan install library
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Download corpus TextBlob (Penting buat sentimen berita)
RUN python -m textblob.download_corpora

# Copy semua file kodingan ke server
COPY . .

# Beri izin akses ke folder database (biar bisa tulis db)
RUN chmod -R 777 /code

# Jalankan Gunicorn di Port 7860 (Port wajib Hugging Face)
CMD ["gunicorn", "-b", "0.0.0.0:7860", "server:app"]