<template>
  <!-- The front page's banners, one at a time. Each slide is the banner block
       as it renders anywhere else. -->
  <UmamiCarousel
    :items="results"
    :label="$t('carousel.label')"
    :next-label="$t('carousel.next')"
    :position-label="positionLabel"
    :previous-label="$t('carousel.previous')"
    :slide-label="slideLabel"
    :slide-role="$t('carousel.slideRole')"
    :slides-label="$t('carousel.slides')"
    :titles="titles"
  >
    <template #default="{ item, index }">
      <DruxtEntity
        :type="item.type"
        :uuid="item.id"
        :kicker="kickers[index] || null"
      />
    </template>
  </UmamiCarousel>
</template>

<script>
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DruxtViewsViewMixin } from 'druxt-views'
import { langMixin } from '../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtViewsViewMixin],

  data: () => ({
    kickers: [],
    titles: [],
  }),

  // Each slide's kicker: the game is new, the first recipe is the recipe of
  // the week, and a later recipe names its category.
  async fetch() {
    // The view lists each banner's type and id; the store holds its fields.
    const slides = await Promise.all(
      (this.results || []).map(async ({ type, id }) => {
        const resource = await this.$store.dispatch('druxt/getResource', {
          type,
          id,
          prefix: this.prefix,
        })
        return ((resource || {}).data || {}).attributes || {}
      })
    )
    this.titles = slides.map((s) => s.field_title)

    let recipes = 0
    this.kickers = await Promise.all(
      slides.map(async (slide) => {
        const path = ((slide.field_content_link || {}).uri || '').replace(
          /^internal:/,
          ''
        )
        if (/\/play$/.test(path)) return this.$t('home.newOnUmami')
        if (recipes++ === 0) return this.$t('home.recipeOfWeek')
        return (await this.category(path)) || this.$t('home.recipeOfWeek')
      })
    )
  },

  watch: {
    results() {
      this.$fetch()
    },
  },

  methods: {
    async category(path) {
      const route = await this.$store.dispatch('druxtRouter/getRoute', path)
      const { type, uuid } = (route || {}).props || {}
      if (!uuid) return null
      const resource = await this.$store.dispatch('druxt/getResource', {
        type,
        id: uuid,
        prefix: this.prefix,
        query: new DrupalJsonApiParams()
          .addInclude(['field_recipe_category'])
          .addFields(type, ['field_recipe_category'])
          .addFields('taxonomy_term--recipe_category', ['name']),
      })
      const term = ((resource || {}).included || [])[0]
      return term ? term.attributes.name : null
    },

    positionLabel(n, count) {
      return this.$t('carousel.position', { n, count })
    },

    slideLabel(n, title) {
      return this.$t('carousel.slide', { n, title })
    },
  },
}
</script>
