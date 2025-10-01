// images.ts
const images = import.meta.glob<{ default: string }>(
  '/src/assets/images/*.{png,jpg,jpeg,svg,JPG}',
  { eager: true }
);

const image: Record<string, string> = Object.keys(images).reduce((acc, path) => {
  const fileName = path.split('/').pop();
  if (fileName) {
    // images[path] is of type { default: string }
    acc[fileName] = (images[path] as { default: string }).default;
  }
  return acc;
}, {} as Record<string, string>);

export default image;
