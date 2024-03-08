import {
  ref, onMounted, onBeforeUnmount, watch
} from 'vue';

export default function useContent(slots, popperNode, content) {
  let observer = null;
  const hasContent = ref(false);

  onBeforeUnmount(() => observer.disconnect());

  /**
   * Watch the content prop
   */
  watch(content, (content) => {
    hasContent.value = !!content;
  });

  /**
   * Check the content slot
   */
  const checkContent = () => {
    hasContent.value = !!slots.content;
  };

  onMounted(() => {
    if (slots.content !== undefined || content.value) {
      hasContent.value = true;
    }

    observer = new MutationObserver(checkContent);
    observer.observe(popperNode.value, {
      childList: true,
      subtree: true,
    });
  });

  return {
    hasContent,
  };
}
