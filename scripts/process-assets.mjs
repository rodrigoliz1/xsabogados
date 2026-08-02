import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandDir = path.join(root, "public/images/brand");
const teamDir = path.join(root, "public/images/team");

await mkdir(brandDir, { recursive: true });

async function makeTransparentMark(source, output, width) {
  const { data, info } = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (
    let sourceIndex = 0, targetIndex = 0;
    sourceIndex < data.length;
    sourceIndex += 3, targetIndex += 4
  ) {
    const luminance = Math.max(
      data[sourceIndex],
      data[sourceIndex + 1],
      data[sourceIndex + 2],
    );
    rgba[targetIndex] = 247;
    rgba[targetIndex + 1] = 247;
    rgba[targetIndex + 2] = 245;
    rgba[targetIndex + 3] =
      luminance < 18 ? 0 : Math.min(255, Math.round((luminance - 18) * 1.09));
  }

  await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

await makeTransparentMark(
  path.join(brandDir, "logo-horizontal-source.png"),
  path.join(brandDir, "logo-horizontal.png"),
  1100,
);
await makeTransparentMark(
  path.join(brandDir, "favicon-source.png"),
  path.join(brandDir, "xs-mark.png"),
  512,
);

await sharp(path.join(brandDir, "favicon-source.png"))
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "src/app/icon.png"));

for (const name of [
  "victor-silva",
  "alejandro-guerrero",
  "isamar-torres",
  "fernando-velasco",
  "rodrigo-lizarraga",
]) {
  await sharp(path.join(teamDir, `${name}.jpg`))
    .resize(900, 900, { fit: "cover" })
    .webp({ quality: 86, effort: 5 })
    .toFile(path.join(teamDir, `${name}.webp`));
}

console.log(
  "Recursos de marca y retratos optimizados sin modificar los originales.",
);
