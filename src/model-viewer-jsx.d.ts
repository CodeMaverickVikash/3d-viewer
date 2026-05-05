import type { ModelViewerElement } from '@google/model-viewer'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerAttributes = DetailedHTMLProps<
  HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  alt?: string
  ar?: boolean | string
  'auto-rotate'?: boolean | string
  'camera-controls'?: boolean | string
  'camera-orbit'?: string
  'camera-target'?: string
  'environment-image'?: string
  exposure?: string | number
  'field-of-view'?: string
  'interaction-prompt'?: string
  'max-camera-orbit'?: string
  'min-camera-orbit'?: string
  'poster'?: string
  'reveal'?: string
  'shadow-intensity'?: string | number
  'shadow-softness'?: string | number
  src?: string
  'touch-action'?: string
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}
