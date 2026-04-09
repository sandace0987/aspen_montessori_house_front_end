// Auto-import all images from src/assets/gallery/
// Naming convention: <priority>_<name>.jpg/png
// e.g. 1_galleryart.jpg, 2_outdoor.jpg
// Lower priority number = shown first

const galleryModules = import.meta.glob<{ default: string }>(
  "/src/assets/gallery/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

export interface GalleryImage {
  src: string;
  alt: string;
  priority: number;
}

function parseFileName(path: string): { priority: number; name: string } {
  const file = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  const match = file.match(/^(\d+)_(.+)$/);
  if (match) {
    return { priority: parseInt(match[1], 10), name: match[2] };
  }
  return { priority: 99, name: file };
}

function formatAlt(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getGalleryImages(): GalleryImage[] {
  return Object.entries(galleryModules)
    .map(([path, mod]) => {
      const { priority, name } = parseFileName(path);
      return { src: mod.default, alt: formatAlt(name), priority };
    })
    .sort((a, b) => a.priority - b.priority || a.alt.localeCompare(b.alt));
}
