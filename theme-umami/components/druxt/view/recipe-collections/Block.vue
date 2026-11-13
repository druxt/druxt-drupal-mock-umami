<template>
  <UmamiCollections
    :links="links"
    :more="{ text: $t('home.more'), to: `${prefix}/recipes` }"
    :title="$t('home.collections')"
  />
</template>

<script>
import { DruxtViewsViewMixin } from 'druxt-views'
import { langMixin } from '../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtViewsViewMixin],

  computed: {
    /** Each term, linked by its alias in the page's language. */
    links() {
      return (this.results || []).map((result) => ({
        id: result.id,
        text: result.attributes.name,
        to: `${this.prefix}${(result.attributes.path || {}).alias}`,
      }))
    },
  },

  druxt: {
    query: {
      fields: ['name', 'path'],
    },
  },
}
</script>
