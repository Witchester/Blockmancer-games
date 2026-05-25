export type UiAssetSize = {
  w: number;
  h: number;
};

export type UiFitMode =
  | 'exact'
  | 'contain'
  | 'cover'
  | 'nineSlice'
  | 'tile'
  | 'iconCenter'
  | 'spriteAnchor'
  | 'vfxCenter';

export type UiScaleMode =
  | 'none'
  | 'integerOnly'
  | 'fitInteger'
  | 'uiStretchNineSlice'
  | 'backgroundExact'
  | 'textDynamic';

export type UiAnchor = 'topLeft' | 'center' | 'bottomCenter' | 'gridTopLeft' | 'vfxCenter';

export type UiCanvasSpec = {
  width: number;
  height: number;
  orientation: 'portrait';
};

export type UiStyleSpec = {
  tone: string;
  pixelArt: boolean;
  safeAreaPadding: number;
  desktopPreview?: string;
};

export type UiCodeGraphSpec = {
  nodeId: string;
  relatedSceneFiles: string[];
  relatedComponents: string[];
  relatedAssetKeys: string[];
  relatedSotDocs: string[];
};

export type UiFontSpec = {
  fontKey: string;
  sizePx: number;
};

export type UiFontSetSpec = {
  title: UiFontSpec;
  body: UiFontSpec;
  number: UiFontSpec;
  small: UiFontSpec;
};

export type UiSectionSpec = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  role: string;
  components: string[];
};

export type UiPixelPerfectSpec = {
  integerCoordinates: boolean;
  allowFractionalScale: boolean;
  filtering: 'nearest' | 'pixelated';
  antiAliasing: boolean;
  roundPixels: boolean;
};

export type UiComponentSpec = {
  id: string;
  type: string;
  assetKey: string;
  fallbackAssetKey: string;
  canonicalFolder: string;
  expectedSourceSize: UiAssetSize;
  runtimeRenderSize: UiAssetSize;
  x: number;
  y: number;
  w: number;
  h: number;
  anchor: UiAnchor;
  fitMode: UiFitMode;
  scaleMode: UiScaleMode;
  safePadding: number;
  zIndex: number;
  dynamicTextAllowed: boolean;
  pixelPerfect: UiPixelPerfectSpec;
  notes?: string;
};

export type UiAssetPlaceholderSpec = {
  assetKey: string;
  fallbackAssetKey: string;
  canonicalFolder: string;
  expectedSourceSize: UiAssetSize;
};

export type UiLayoutSpec = {
  screenId: string;
  screenName: string;
  canvas: UiCanvasSpec;
  entryFrom: string[];
  exitTo: string[];
  purpose: string;
  style: UiStyleSpec;
  codegraph: UiCodeGraphSpec;
  fonts: UiFontSetSpec;
  sections: UiSectionSpec[];
  components: UiComponentSpec[];
  assetPlaceholders: UiAssetPlaceholderSpec[];
  interactions: string[];
  fallbackRules: string[];
  acceptanceCriteria: string[];
};

export type UiLayoutValidationSeverity = 'error' | 'warning';

export type UiLayoutValidationIssue = {
  severity: UiLayoutValidationSeverity;
  code: string;
  message: string;
  screenId?: string;
  componentId?: string;
  sectionId?: string;
  field?: string;
};

export type UiLayoutValidationResult = {
  isValid: boolean;
  errors: UiLayoutValidationIssue[];
  warnings: UiLayoutValidationIssue[];
};
