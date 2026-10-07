"""Fit twenty approved AI restorations on equal canvases without cropping.
Usage: python scripts/prepare-case-photos.py manifest.json
Manifest maps output filenames to approved generated image paths. Requires Pillow.
"""
from pathlib import Path
import json
import sys
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
target = root / 'public/images/cases'
target.mkdir(parents=True, exist_ok=True)
manifest = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
assert len(manifest) == 20, 'All twenty approved images are required'
report = []
for filename, source in manifest.items():
    photo = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    scale = min(1600 / photo.width, 1000 / photo.height)
    size = (round(photo.width * scale), round(photo.height * scale))
    fitted = photo.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (1600, 1000), (0, 0, 0, 0))
    canvas.paste(fitted, ((1600-size[0])//2, (1000-size[1])//2))
    canvas.save(target / filename, 'WEBP', quality=95, method=4)
    report.append(dict(file=filename, processing='AI restoration',
                       contentSize=size, canvasSize=[1600, 1000]))
(target / 'processing.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f'Prepared {len(report)} AI-restored photographs, each 1600x1000.')
