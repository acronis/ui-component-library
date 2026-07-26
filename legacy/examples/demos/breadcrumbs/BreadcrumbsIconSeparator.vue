<script setup>
  import BreadcrumbItem from '@/components/breadcrumbs/breadcrumbItem.vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  // import { IconChevronRight16 } from '@acronis-platform/icons/chevron';
  import { IconArrowRight16 } from '@acronis-platform/icons/arrow';
</script>

<template>
  <Breadcrumbs :separator-icon="IconArrowRight16">
    <BreadcrumbItem to="/">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem to="/products">
      Products
    </BreadcrumbItem>
    <BreadcrumbItem to="/customers">
      Customers
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
