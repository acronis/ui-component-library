<script setup>
  import BreadcrumbItem from '@/components/breadcrumbs/breadcrumbItem.vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
</script>

<template>
  <Breadcrumbs separator="/">
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
