<template>
  <UmamiBanner
    v-if="!$fetchState.pending"
    :cta="{
      text: fields.field_content_link.data.title,
      to: fields.field_content_link.data.uri.replace('internal:', ''),
    }"
    :img="img"
    :kicker="kicker || $t('home.recipeOfWeek')"
    :summary="fields.field_summary.data"
    :title="fields.field_title.data"
  />
</template>

<script>
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DruxtEntityMixin } from 'druxt-entity'
import { mapActions } from 'vuex'

/** A banner block: its title, summary, link and image, on UmamiBanner. */
export default {
  mixins: [DruxtEntityMixin],

  props: {
    /** Editorial eyebrow above the banner title; the locale's when unset. */
    kicker: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    img: false,
  }),

  async fetch() {
    if (!this.model.relationships.field_media_image) {
      return
    }

    const resource = await this.getResource({
      ...this.model.relationships.field_media_image.data,
      query: new DrupalJsonApiParams()
        .addInclude(['field_media_image'])
        .addFields('media--image', [])
        .addFields('file--file', ['uri']),
    })

    this.img =
      (this.$config.baseUrl || '') +
      (resource.included.find((o) => o.type === 'file--file') || {}).attributes
        .uri.url
  },

  methods: {
    ...mapActions({
      getResource: 'druxt/getResource',
    }),
  },
}
</script>
