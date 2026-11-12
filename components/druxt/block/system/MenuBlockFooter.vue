<template>
  <UmamiFeedback :title="$t('home.feedbackTitle')">
    <!-- The menu item is used when it exists; otherwise the contact route is
         linked directly. -->
    <DruxtMenu component="div" name="footer">
      <template #default="{ items }">
        <b-button
          v-if="contact(items)"
          :to="contact(items).to"
          variant="primary"
        >
          {{ contact(items).title }}
        </b-button>
        <b-button v-else :to="fallback" variant="primary">{{
          $t('home.feedbackButton')
        }}</b-button>
      </template>
    </DruxtMenu>
  </UmamiFeedback>
</template>

<script>
import { DruxtBlocksBlockMixin } from 'druxt-blocks'

export default {
  mixins: [DruxtBlocksBlockMixin],

  computed: {
    fallback() {
      const lang = (this.$route.path.match(/^\/(en|es)(\/|$)/) || [])[1] || 'en'
      return `/${lang}/contact`
    },
  },

  methods: {
    contact(items = []) {
      const match = items.find((i) => i.entity.id === 'contact.site_page')
      if (!match) {
        return null
      }
      return {
        title: match.entity.attributes.title,
        to: match.entity.attributes.url || this.fallback,
      }
    },
  },
}
</script>
