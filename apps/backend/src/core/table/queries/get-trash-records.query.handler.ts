import type { IQueryHandler } from '@nestjs/cqrs'
import { QueryHandler } from '@nestjs/cqrs'
import { ClsStore, IClsService, type IRecordQueryModel, type ITableRepository } from '@undb/core'
import type { IGetTrashRecordsOutput } from '@undb/cqrs'
import { GetTrashRecordsQuery, GetTrashRecordsQueryHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordQueryModel } from '../adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../adapters/sqlite/table-sqlite.repository.js'

@QueryHandler(GetTrashRecordsQuery)
// @ts-ignore
export class NestGetTrashRecordsQueryHandler
  extends GetTrashRecordsQueryHandler
  implements IQueryHandler<GetTrashRecordsQuery, IGetTrashRecordsOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectRecordQueryModel()
    protected readonly rm: IRecordQueryModel,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(tableRepo, rm, cls as IClsService<ClsStore>)
  }
}
