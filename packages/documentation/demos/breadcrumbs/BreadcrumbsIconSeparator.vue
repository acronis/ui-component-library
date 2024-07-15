<script setup>
  import IconChevronRight16 from '@acronis-platform/icons/acronis/chevron/IconChevronRight16.vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';
</script>

<template>
  <Breadcrumbs :separator="IconChevronRight16">
    <BreadcrumbLink to="/">
      Home
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-folder-o--16"
      to="/products"
    >
      Products
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-customer-o--16"
      to="/customers"
    >
      Customers
    </BreadcrumbLink>
  </Breadcrumbs>
</template>
