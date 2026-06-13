from PIL import Image
import os

src = r"C:\Users\melos\.cursor\projects\c-Users-melos-OneDrive-Desktop-HARDHLOSI\assets\c__Users_melos_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_IMG_9389-e5dd6820-ac32-463c-a8d0-cae411b8bc41.png"
out_dir = r"C:\Users\melos\OneDrive\Desktop\HARDHLOSI\assets\images"
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "hardhfest-app-news.png")

img = Image.open(src).convert("RGB")
w, h = img.size

# Detect top overlay bar: scan rows until content (non-near-black) dominates
crop_top = 0
for y in range(min(120, h)):
    dark = 0
    samples = 0
    for x in range(0, w, max(1, w // 80)):
        r, g, b = img.getpixel((x, y))
        samples += 1
        if r < 30 and g < 30 and b < 30:
            dark += 1
    if dark / samples < 0.85:
        crop_top = y
        break
    crop_top = y + 1

# Ensure overlay strip is fully removed
crop_top = max(crop_top, 58)

cropped = img.crop((0, crop_top, w, h))
cropped.save(out, "PNG", optimize=True)
print(f"original={w}x{h} crop_top={crop_top} saved={out} new={cropped.size[0]}x{cropped.size[1]}")
