<template>
  <UmamiMasthead
    :language-label="$t('nav.language')"
    :languages="languages"
    :menu-label="$t('nav.openMenu')"
  >
    <!-- DruxtBlock wraps each block in a div of its own. -->
    <template #brand>
      <slot name="umami_branding" />
    </template>

    <template #menu>
      <DruxtBlockSystemMenuBlockMain />
    </template>
  </UmamiMasthead>
</template>

<script>
import { langSwitchMixin } from '../../../utils/lang'

/**
 * The `header` region: the masthead, with Drupal's branding block, the main
 * menu and the language links. The Umami demo's search button is left out:
 * this site has no search.
 */
export default {
  // The language links: each one to that language's version of the page.
  mixins: [langSwitchMixin],

  fetchKey: 'lang-switch-header',
}
</script>
