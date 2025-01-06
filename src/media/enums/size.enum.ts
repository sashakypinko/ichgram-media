export enum SizeLabel {
  THUMBNAIL = 'thumbnail',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'xlarge',
}

export const Size = {
  [SizeLabel.THUMBNAIL]: 150,
  [SizeLabel.SMALL]: 300,
  [SizeLabel.MEDIUM]: 600,
  [SizeLabel.LARGE]: 1024,
  [SizeLabel.XLARGE]: 1920,
}
