import { ref } from 'vue';
import { TABLE_MIN_RESIZE_WIDTH } from '../constants.ts';

export function useResizingColumns(columns, callback) {
  const isResizing = ref(false);

  function onResize(resizeEvent, columnKey) {
    isResizing.value = true;
    const th = resizeEvent.target.parentElement;
    const columnIndex = columns.value.findIndex(c => c.key === columnKey);
    const initialWidth = th.offsetWidth;
    const initialX = resizeEvent.clientX;

    const onMouseMove = mouseMoveEvent => requestAnimationFrame(() => {
      const dx = mouseMoveEvent.clientX - initialX;
      const width = Math.max(TABLE_MIN_RESIZE_WIDTH, initialWidth + dx);
      th.style.width = `${width}px`;
      columns.value[columnIndex].width = width;
      callback();
    });

    const onMouseUp = () => {
      isResizing.value = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  return {
    isResizing,
    onResize
  };
}
