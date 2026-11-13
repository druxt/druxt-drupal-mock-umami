<template>
  <UmamiMobileDrawer
    :close-label="$t('nav.closeMenu')"
    :credit-label="$t('demoBar.builtWith')"
    credit-href="https://druxtjs.org"
    credit-text="druxtjs.org"
    :languages="languages"
    :path="$route.path"
    :tagline="$t('site.tagline')"
  >
    <template #menu="{ hide }">
      <DruxtMenu class="drawer__menu" component="nav" name="main">
        <!-- The slot replaces the menu's own list item, so it keeps one:
             a list holds nothing but items. -->
        <template #item="{ item: { entity }, to }">
          <li class="drawer__item">
            <nuxt-link class="drawer__link" :to="to" @click.native="hide">
              {{ entity.attributes.title }}
            </nuxt-link>
          </li>
        </template>
      </DruxtMenu>
    </template>

    <template #credit-icon>
      <AppDruxtLogo class="drawer__druxt-logo" />
    </template>
  </UmamiMobileDrawer>
</template>

<script>
import { langSwitchMixin } from '../../utils/lang'

/** The phone menu: Drupal's main menu and the language buttons, in the drawer. */
export default {
  // The language buttons: each one to that language's version of the page.
  mixins: [langSwitchMixin],

  fetchKey: 'lang-switch-drawer',
}
</script>
