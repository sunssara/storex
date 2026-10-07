# Case photographs

The twenty images in `public/images/cases/` are AI-restored versions of the journal photographs, prepared with the built-in image generation tool. The user approved small reconstructed details in favor of image quality. Originals remain in `public/images/`.

All slides use 1600 x 1000 canvases, fit the full image proportionally and blend unused transparent space into the active theme. The frame stays 16:10 on desktop and mobile. These versions are used on case detail pages; homepage covers and project cards are unchanged.

Restoration prompt: Restore the real completed-project photo as a high-quality professional architectural/technology photograph. Remove blur, compression artifacts and noise; restore natural textures and sharp detail. Preserve the recognizable room, layout, main objects, camera position, full framing, perspective and original palette. Minor reconstruction of small details is acceptable. Do not redesign the space, replace equipment or add people. No dramatic grading, neon effects, excessive contrast, oversharpening, zoom, crop, overlays or collage.

The first KTZ image used a stricter version requiring preservation of details; its reconstructed small details were subsequently accepted under the same user instruction.

`scripts/prepare-case-photos.py` fits generated files from a local manifest without cropping. `public/images/cases/processing.json` records dimensions. Restorations are illustrative improvements, not new evidence of equipment specifications.
