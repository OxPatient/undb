import { Button, IconFilter, Popover, Space, useDisclosure } from '@egodb/ui'
import { useState } from 'react'
import { trpc } from '../../trpc'
import { FiltersEditor } from '../filters-editor/filters-editor'
import type { ITableBaseProps } from './table-base-props'

export const TableFilterEditor: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, handler] = useDisclosure(false)
  const [filterTotal, setFilterTotal] = useState<number>()

  const utils = trpc.useContext()

  const setFilter = trpc.table.setFilter.useMutation({
    onSuccess: () => {
      handler.close()

      utils.table.get.refetch({ id: table.id.value })
      utils.record.list.refetch({ tableId: table.id.value })
    },
  })

  return (
    <Popover position="bottom-start" opened={opened} onChange={handler.toggle} closeOnClickOutside>
      <Popover.Target>
        <Button
          size="xs"
          variant="outline"
          loading={setFilter.isLoading}
          leftIcon={<IconFilter size={18} />}
          onClick={handler.toggle}
        >
          Filter
          <Space w="xs" />
          {filterTotal}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <FiltersEditor
          table={table}
          onApply={(filter) => {
            setFilter.mutate({ tableId: table.id.value, filter })
            setFilterTotal(filter.length)
          }}
          onCancel={handler.close}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
