<template>
  <UmamiBrand :tagline="$t('site.tagline')" />
</template>

<script>
import { DruxtBlocksBlockMixin } from 'druxt-blocks'

/**
 * The Umami logo.svg is a raster-ish mark that sat awkwardly at the new
 * masthead size, so the branding block renders a type wordmark instead. The
 * block is still placed and configured in Drupal.
 */
export default {
  mixins: [DruxtBlocksBlockMixin],
}
</script>
