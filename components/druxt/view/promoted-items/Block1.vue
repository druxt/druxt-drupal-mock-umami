<template>
  <!-- Image, kicker, headline. Both wrappers are display: contents, so every
       teaser is a direct item of the strip. -->
  <UmamiFeaturedStrip :label="$t('home.thisWeek')">
    <slot name="results" :wrapper="{ class: 'contents', component: 'div' }" />
    <slot
      name="attachments_after"
      :wrapper="{ class: 'contents', component: 'div' }"
    />
  </UmamiFeaturedStrip>
</template>

<script>
import { DruxtViewsViewMixin } from 'druxt-views'

export default {
  mixins: [DruxtViewsViewMixin],
}
</script>
