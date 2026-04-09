

# Replace Program & Hero Images (MIN Optimized)

## What
Replace 7 images with the uploaded photos, applying MIN optimization (convert to JPG, max 1200px wide, 75% quality, strip metadata). For portrait-oriented uploads, smart-crop to landscape keeping the subject centered.

## Image Mapping

| Upload | Target Asset | Used In |
|--------|-------------|---------|
| IMG_6045.HEIC | `src/assets/hero-video-poster.jpg` | HeroSection, index.html preload |
| IMG_6020.JPG | `src/assets/teacher-child.jpg` | LearningSection |
| IMG_6733.heic | `src/assets/program-toddlers.jpg` | ProgramsSection, Programs page |
| IMG_5969.HEIC | `src/assets/program-m1.jpg` | ProgramsSection, Programs page |
| IMG_6896.jpg | `src/assets/program-m2.jpg` | ProgramsSection, Programs page |
| IMG_6739.heic | `src/assets/program-m3.jpg` | Programs page |
| IMG_5964.HEIC | `src/assets/program-daycare.jpg` | ProgramsSection, Programs page |

## How

1. Copy all 7 uploads to `/tmp/`
2. Use ImageMagick to process each:
   - Convert HEIC/JPG to JPG
   - Auto-orient (fix rotation metadata)
   - For portrait images used in landscape slots (hero poster, program cards, teacher-child): smart-crop to 4:3 or 16:9 landscape using gravity center, keeping the best/central portion visible
   - Resize to max 1200px wide
   - Compress at 75% quality, strip metadata
3. Copy processed files to `src/assets/` overwriting existing assets
4. No code changes needed -- filenames stay the same

## Portrait-to-Landscape Handling
- Hero poster (IMG_6045): crop to 16:9 landscape, gravity center
- Program cards (toddlers, m1, m2, m3, daycare): crop to 4:3 landscape, gravity center
- Teacher-child (IMG_6020): crop to 4:3 landscape, gravity center
- Images already in landscape orientation will just be resized, not cropped

