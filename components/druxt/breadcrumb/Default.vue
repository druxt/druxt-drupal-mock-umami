<template>
  <UmamiBreadcrumb :items="items" />
</template>

<script>
import { DruxtBreadcrumbMixin } from 'druxt-breadcrumb'

export default {
  mixins: [DruxtBreadcrumbMixin],

  computed: {
    /** The trail without its home step: the masthead's brand is the way home. */
    items() {
      return (this.crumbs || []).filter((item) => item.to !== '/')
    },
  },
}
</script>
