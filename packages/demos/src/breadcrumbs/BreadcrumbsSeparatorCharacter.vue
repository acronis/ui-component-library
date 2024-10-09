<script setup>
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
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
