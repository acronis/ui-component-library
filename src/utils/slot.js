export function slot(vm, slotName, otherwise) {
  return vm.$scopedSlots[slotName] !== undefined
    ? vm.$scopedSlots[slotName]()
    : otherwise;
}
