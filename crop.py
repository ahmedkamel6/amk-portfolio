from PIL import Image

def crop_and_square(input_path, output_path):
    # Open the image
    img = Image.open(input_path).convert("RGBA")
    
    # Get the bounding box of the non-zero (non-transparent) alpha channel
    bbox = img.getbbox()
    if bbox:
        # Crop to the bounding box
        img_cropped = img.crop(bbox)
        
        # Calculate new dimensions for a square
        width, height = img_cropped.size
        max_dim = max(width, height)
        
        # Create a new square transparent image
        square_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
        
        # Paste the cropped image into the center of the square
        offset = ((max_dim - width) // 2, (max_dim - height) // 2)
        square_img.paste(img_cropped, offset)
        
        # Save the result
        square_img.save(output_path)
        print(f"Successfully processed and saved to {output_path}")
    else:
        print("Image is entirely transparent, nothing to crop.")

# Process both logo and icon
crop_and_square("public/logo.png", "public/logo.png")
crop_and_square("src/app/icon.png", "src/app/icon.png")
