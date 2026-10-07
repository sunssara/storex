"""Normalize twenty approved AI-outpainted 16:10 images without empty margins.
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
    # AI output can differ by one or two pixels from the requested ratio.
    # Reject materially different ratios rather than cropping or stretching subjects.
    assert abs((photo.width / photo.height) / 1.6 - 1) < .01, filename
    canvas = ImageOps.fit(photo, (1600, 1000), method=Image.Resampling.LANCZOS)
    canvas.save(target / filename, 'WEBP', quality=95, method=4)
    report.append(dict(file=filename, processing='AI restoration and edge outpainting',
                       contentSize=[1600, 1000], canvasSize=[1600, 1000], opaque=True))
(target / 'processing.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f'Prepared {len(report)} AI-restored photographs, each 1600x1000.')
