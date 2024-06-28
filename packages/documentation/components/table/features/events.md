# Table events

| Name              | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| click-row         | Emits when a table row is clicked. click here foe more information |
| expand-row        | Emits when expanding a row. click here foe more information        |
| update-sort       | Emits when sort type or sort field updates.                        |
| update-page-item  | Emits when page items updates.                                     |
| contextmenu-row   | Emits when right click (contextmenu).                              |
| select-all        | Emits when all rows are selected.                                  |


| Event Name               | Description                                                        | Parameters                                       |
|--------------------------|--------------------------------------------------------------------|--------------------------------------------------|
| cell-click               | triggers when clicking a cell                                      | row, column, cell, event                         |
| cell-dblclick            | triggers when double clicking a cell                               | row, column, cell, event                         |
| cell-mouse-enter         | triggers when hovering into a cell                                 | row, column, cell, event                         |
| cell-mouse-leave         | triggers when hovering out of a cell                               | row, column, cell, event                         |
| column-order-change      | triggers when Table's column order changes                         | columns                                          |
| column-visibility-change | Triggers when a column is shown or hidden by the columns selector. | column, visible                                  |
| current-change           | triggers when current row changes                                  | currentRow, oldCurrentRow                        |
| header-click             | triggers when clicking a column header                             | column, event                                    |
| header-dragend           | triggers when finish dragging header                               | newWidth, oldWidth, column, event                |
| row-action               | triggers when clicking a row-action                                | ({ command, row })                               |
| row-click                | triggers when clicking a row                                       | row, event, column                               |
| row-dblclick             | triggers when double clicking a row                                | row, event                                       |
| scroll                   | triggers when user scroll the table                                | scrollTop, scrollLeft, scrollHeight, scrollWidth |
| select                   | triggers when user clicks the checkbox in a row                    | selection, row                                   |
| select-all               | triggers when user clicks the checkbox in table header             | selection                                        |
| selection-change         | triggers when selection changes                                    | selection                                        |
| sort-change              | triggers when Table's sorting changes                              | ({ column, prop, order })                        |
