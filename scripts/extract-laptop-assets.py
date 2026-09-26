from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "assets" / "main"


def polygon_mask(size, polygons):
    scale = 4
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon([(x * scale, y * scale) for x, y in polygon], fill=255)
    return np.asarray(mask.resize(size, Image.Resampling.LANCZOS), dtype=np.uint8)


def remove_white_background(source_name, output_name, laptop_polygons):
    source = Image.open(ROOT / source_name).convert("RGB")
    rgb = np.asarray(source, dtype=np.float32)
    height, width = rgb.shape[:2]

    laptop_alpha = polygon_mask((width, height), laptop_polygons)

    # Recover transparency from a white composite. The laptop itself stays
    # fully opaque; outside it, only the supplied coloured light and contact
    # shadow remain. No blur, generated glow, filter, or replacement geometry.
    white_distance = 255 - rgb.min(axis=2)
    ambient_alpha = np.clip((white_distance - 9) * 2.45, 0, 210)
    ambient_alpha = np.where(laptop_alpha > 0, 0, ambient_alpha)
    alpha = np.maximum(laptop_alpha, ambient_alpha).astype(np.uint8)

    a = np.maximum(ambient_alpha / 255, 1 / 255)
    recovered = (rgb - (1 - a[:, :, None]) * 255) / a[:, :, None]
    recovered = np.clip(recovered, 0, 255)
    output_rgb = np.where(
        (laptop_alpha > 0)[:, :, None],
        rgb,
        recovered,
    ).astype(np.uint8)

    rgba = np.dstack([output_rgb, alpha])
    Image.fromarray(rgba, "RGBA").save(OUTPUT / output_name, optimize=True)


LAPTOP_SILHOUETTE = [
    [(501, 157), (1340, 91), (1283, 762), (430, 711)],
    [(430, 711), (1283, 762), (1280, 806), (1102, 870), (221, 851), (84, 780), (420, 710)],
]

remove_white_background(
    "laptop_purple_Left.png",
    "action-business-laptop-L.png",
    LAPTOP_SILHOUETTE,
)

remove_white_background(
    "laptop_green_left.png",
    "action-cs-laptop-L.png",
    LAPTOP_SILHOUETTE,
)
