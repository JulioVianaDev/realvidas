import { PipelineColumnColor } from '../entities/pipeline.entity-type';

export type PipelineColumnPaletteColor = Exclude<
  PipelineColumnColor,
  'none'
>;

export const PIPELINE_COLUMN_COLOR_PALETTE: PipelineColumnPaletteColor[] = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'teal',
  'pink',
  'yellow',
];

export function pickRandomPipelineColumnColor(
  usedColors: readonly PipelineColumnColor[] = [],
): PipelineColumnPaletteColor {
  const used = new Set<PipelineColumnPaletteColor>(
    usedColors.filter(
      (color): color is PipelineColumnPaletteColor => color !== 'none',
    ),
  );
  const available = PIPELINE_COLUMN_COLOR_PALETTE.filter(
    (color) => !used.has(color),
  );
  const pool =
    available.length > 0 ? available : PIPELINE_COLUMN_COLOR_PALETTE;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function resolvePipelineColumnColor(
  color: PipelineColumnColor | undefined,
  usedColors: readonly PipelineColumnColor[] = [],
): PipelineColumnPaletteColor {
  if (color && color !== 'none') {
    return color;
  }
  return pickRandomPipelineColumnColor(usedColors);
}
