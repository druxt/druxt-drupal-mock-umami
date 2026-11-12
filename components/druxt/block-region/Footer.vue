<template>
  <!-- The layout's band already holds the container, so this is a row only. -->
  <UmamiSplit>
    <template #main>
      <slot name="umami_footer_promo" />
    </template>

    <template #aside>
      <slot name="umami_footer" />
    </template>
  </UmamiSplit>
</template>
