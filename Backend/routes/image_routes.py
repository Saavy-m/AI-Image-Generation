import os
import openai
import boto3
from flask import Blueprint, request, jsonify
from datetime import datetime
from io import BytesIO
import requests
from database import get_db_connection


image_bp = Blueprint("image", __name__)

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# AWS S3 Configuration
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_S3_BUCKET")
AWS_REGION = os.getenv("AWS_S3_REGION")

# Initialize S3 Client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

def upload_to_s3(image_bytes, filename):
    """Uploads image to S3 and returns the public URL."""
    s3_client.upload_fileobj(
        BytesIO(image_bytes),
        AWS_BUCKET_NAME,
        filename,
        ExtraArgs={"ContentType": "image/png"}  # ✅ Remove "ACL": "public-read"
    )
    return f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"


@image_bp.route("/generate", methods=["POST"])
def generate_image():
    data = request.json
    prompt = data.get("prompt")
    user_id = data.get("user_id")

    if not user_id or not prompt:
        return {"error": "user_id and prompt are required"}, 400

    try:
        openai.api_key = OPENAI_API_KEY
        
        # Generate image using the updated OpenAI API
        response = openai.images.generate(
            model="dall-e-3",  # Change to "dall-e-2" if needed
            prompt=prompt,
            size="1024x1024",
            n=1
        )

        image_url = response.data[0].url  # Extract image URL

        if not image_url:
            return jsonify({"error": "Image generation failed"}), 500

        # Download the generated image
        image_response = requests.get(image_url)
        if image_response.status_code != 200:
            return jsonify({"error": "Failed to download generated image"}), 500

        # Generate filename with timestamp
        filename = f"generated_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"

        # # Upload to S3
        s3_url = upload_to_s3(image_response.content, filename)
        created_at = datetime.utcnow()

        # Store in DB
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO images (user_id, prompt, image_url , created_at) VALUES (%s, %s, %s, %s) RETURNING id",
                   (user_id, prompt, s3_url , created_at))
        image_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"image_id": image_id, "image_url": s3_url}), 200


    except openai.OpenAIError as e:
        return jsonify({"error": str(e)}), 500


@image_bp.route("/images/<int:user_id>", methods=["GET"])
def get_images_by_user(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, image_url, prompt, created_at FROM images WHERE user_id = %s", (str(user_id),))
    images = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {"id": img[0], "image_url": img[1], "prompt": img[2], "created_at": img[3].isoformat()}
        for img in images
    ]), 200


@image_bp.route("/image/<int:image_id>", methods=["GET"])
def get_image_by_id(image_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, user_id, image_url, prompt, created_at FROM images WHERE id = %s", (image_id,))
    img = cur.fetchone()
    cur.close()
    conn.close()

    if not img:
        return jsonify({"error": "Image not found"}), 404

    return jsonify({
        "id": img[0],
        "user_id": img[1],
        "image_url": img[2],
        "prompt": img[3],
        "created_at": img[4].isoformat()
    }), 200

@image_bp.route("/image_delete/<int:image_id>" , methods=["DELETE"])
def del_image_by_id(image_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM images WHERE id = %s" , (image_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"msg":"Image delete from database"})
