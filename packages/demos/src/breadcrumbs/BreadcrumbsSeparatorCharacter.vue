<script setup>
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';
</script>

<template>
  <Breadcrumbs separator="/">
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
