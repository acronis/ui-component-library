<script setup>
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import AcvScrollbar from '@/components/scrollbar/scrollbar.vue';
</script>

<template>
  <div
    style="height: 200px"
  >
    <AcvScrollbar
      auto
      class="test-scrollbar"
    >
      <AcvMenu
        default-active="4"
        type="secondary"
      >
        <AcvMenuItem
          v-for="i in 15"
          :key="i"
          :index="`${i}index`"
        >
          <template #icon>
            <AcvIcon
              name="folder-o--16"
            />
          </template>
          <template #title>
            Windows Defender Antivirus
          </template>
        </AcvMenuItem>
      </AcvMenu>
    </AcvScrollbar>
  </div>
</template>

<style scoped>
.test-scrollbar {
  background-color: var(--acv-color-brand-secondary);
}
</style>
