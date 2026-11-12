<template>
  <UmamiPromo
    v-if="!$fetchState.pending"
    :cta="link"
    :img="img"
    :kicker="$t('home.inPrint')"
  >
    <template #title>
      <slot name="field_title" />
    </template>

    <template #summary>
      <slot
        name="field_summary"
        :wrapper="{ class: 'promo__summary', component: 'div' }"
      />
    </template>
  </UmamiPromo>
</template>

<script>
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DruxtEntityMixin } from 'druxt-entity'
import { mapActions } from 'vuex'

/**
 * The image is resolved here, as BannerBlock.vue does it: rendered through
 * <slot name="field_media_image" />, its file URL did not resolve.
 */
export default {
  mixins: [DruxtEntityMixin],

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

    const file = resource.included.find((o) => o.type === 'file--file')
    if (file) {
      this.img = (this.$config.baseUrl || '') + file.attributes.uri.url
    }
  },

  computed: {
    /**
     * The link field holds an unprefixed internal URI, so the button used to
     * send a Spanish reader to the English page.
     */
    link() {
      const field = (this.fields || {}).field_content_link
      if (!field || !field.data) {
        return null
      }
      const langcode =
        (this.$route.path.match(/^\/(en|es)(\/|$)/) || [])[1] || 'en'
      const path = field.data.uri.replace('internal:', '')
      const title = (this.fields || {}).field_title
      return {
        // The block's title, read out after a generic label like "Más información".
        target: title && title.data,
        text: field.data.title,
        to: `/${langcode}${path}`,
      }
    },
  },

  methods: {
    ...mapActions({
      getResource: 'druxt/getResource',
    }),
  },
}
</script>
