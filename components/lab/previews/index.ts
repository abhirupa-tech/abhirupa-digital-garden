import type { ComponentType } from 'react';
import type { LabPreviewId } from '@/lib/lab';
import { MorphologyPreview } from './MorphologyPreview';
import { RecPreview } from './RecPreview';

/** Live, code-drawn tile previews, keyed from the lab registry. */
export const LAB_PREVIEWS: Record<LabPreviewId, ComponentType> = {
  morphology: MorphologyPreview,
  rec: RecPreview,
};
