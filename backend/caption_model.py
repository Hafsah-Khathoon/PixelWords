
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

MODEL_NAME = "Salesforce/blip-image-captioning-base"

print("Loading PixelWords AI model...")

processor = BlipProcessor.from_pretrained(MODEL_NAME)

model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)
model.eval()

print("PixelWords AI model is ready!")


def generate_caption(image):
    inputs = processor(image, return_tensors="pt")

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=40,
            num_beams=2
        )

    return processor.decode(
        output[0],
        skip_special_tokens=True
    )
