import { buildZodFieldConfig } from '@autoform/react'
import type { FieldTypes } from './AutoForm'

export const fieldConfig = buildZodFieldConfig<
  FieldTypes,
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  {
    // Add types for `customData` here.
  }
>()
