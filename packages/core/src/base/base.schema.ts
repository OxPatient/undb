import { z } from 'zod'
import { tableIdSchema } from '../table/index.js'
import { baseIdSchema, baseNameSchema } from './value-objects/index.js'

export const queryBase = z.object({
  id: baseIdSchema,
  name: baseNameSchema,
})

export type IQueryBase = z.infer<typeof queryBase>

export const createBaseSchema = z.object({
  name: baseNameSchema,
})

export type ICreateBaseSchema = z.infer<typeof createBaseSchema>

export const moveToBaseSchema = z.object({
  tableId: tableIdSchema,
  baseId: baseIdSchema,
})

export type IMoveToBaseSchema = z.infer<typeof moveToBaseSchema>
