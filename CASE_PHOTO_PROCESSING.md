# Case photographs

The twenty images in `public/images/cases/` are AI-restored versions of the journal photographs, prepared with the built-in image generation tool. The user approved small reconstructed details in favor of image quality. Originals remain in `public/images/`.

All slides are opaque 1600 x 1000 photographs. Former unused side margins have been filled by AI outpainting of walls, floors, ceilings and other surrounding scene content. No transparent, white or black bars are added. Objects are not stretched; only sub-percent normalization of the generated aspect ratio is allowed. The frame stays 16:10 on desktop and mobile. These versions are used on case detail pages; homepage covers and project cards are unchanged.

Restoration prompt: Restore the real completed-project photo as a high-quality professional architectural/technology photograph. Remove blur, compression artifacts and noise; restore natural textures and sharp detail. Preserve the recognizable room, layout, main objects, camera position, full framing, perspective and original palette. Minor reconstruction of small details is acceptable. Do not redesign the space, replace equipment or add people. No dramatic grading, neon effects, excessive contrast, oversharpening, zoom, crop, overlays or collage.

The first KTZ image used a stricter version requiring preservation of details; its reconstructed small details were subsequently accepted under the same user instruction.

Outpainting prompt: Fill only empty side margins with seamless photographic continuation of the same scene. Preserve the existing central photo scale, framing, proportions and position; no zoom, stretch or redesign. Match perspective, lighting, texture and colors. Produce full landscape 16:10 content without transparent pixels, bars, blurred or mirrored filler. Extend the neutral background for the product controller photo.

`scripts/prepare-case-photos.py` normalizes approved 16:10 generated files from a local manifest. `public/images/cases/processing.json` records dimensions. Restorations and extended surroundings are illustrative improvements, not new evidence of equipment specifications.
