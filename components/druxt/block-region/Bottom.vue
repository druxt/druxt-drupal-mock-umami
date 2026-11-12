<template>
  <UmamiFooterGrid
    :copyright="copyright || ''"
    :credit-label="$t('demoBar.builtWith')"
    credit-href="https://druxtjs.org"
    credit-text="druxtjs.org"
  >
    <!-- The disclaimer block. -->
    <template #brand>
      <slot name="umami_disclaimer" />
    </template>

    <template #menu>
      <DruxtMenu
        class="site-footer__col site-footer__col--menu"
        component="nav"
        name="footer"
      >
        <template #default="{ items }">
          <span class="site-footer__kicker">{{ $t('site.magazine') }}</span>
          <DruxtMenuItem
            v-for="item in items"
            :key="item.entity.id"
            :item="item"
          />
        </template>

        <template #item="{ item: { entity }, to }">
          <nuxt-link class="site-footer__link" :to="to">
            {{ entity.attributes.title }}
          </nuxt-link>
        </template>
      </DruxtMenu>
    </template>
  </UmamiFooterGrid>
</template>

<script>
import { mapActions } from 'vuex'

/**
 * The `bottom` region: the footer's columns, with Drupal's disclaimer block,
 * its footer menu and the disclaimer's copyright line. The footer menu is
 * pulled in here directly (DruxtMenu name="footer"): MenuBlockFooter filters
 * that menu down to a single contact button.
 */
export default {
  props: {
    /** The region's block resources, from DruxtBlockRegion. */
    blocks: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    copyright: null,
  }),

  async fetch() {
    const block = this.blocks.find(
      (o) => (o.attributes || {}).drupal_internal__id === 'umami_disclaimer'
    )
    if (!block) {
      return
    }
    // The region asks only for ids and weights, so the block's settings,
    // which name its content, are fetched here.
    const placed = await this.getResource({
      type: block.type,
      id: block.id,
      query: { fields: { [block.type]: 'settings' } },
    })
    const id =
      ((((placed || {}).data || {}).attributes || {}).settings || {}).id || ''
    const uuid = id.split(':')[1]
    if (!uuid) {
      return
    }
    const type = 'block_content--disclaimer_block'
    const resource = await this.getResource({
      type,
      id: uuid,
      query: { fields: { [type]: 'field_copyright' } },
    })
    const field = (((resource || {}).data || {}).attributes || {})
      .field_copyright
    this.copyright = (field || {}).processed || null
  },

  methods: {
    ...mapActions({
      getResource: 'druxt/getResource',
    }),
  },
}
</script>
