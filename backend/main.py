
from caption_model import generate_caption as create_caption

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
import io

app = FastAPI(title="PixelWords API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to PixelWords API!"}


@app.post("/caption")
async def generate_caption(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, JPEG, or PNG image."
        )

    image_bytes = await file.read()

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image."
        )

    caption = create_caption(image)

    return {
        "message": "Caption generated successfully!",
        "filename": file.filename,
        "image_size": image.size,
        "caption": caption
    }
