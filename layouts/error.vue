<template>
  <UmamiErrorPage
    :detail="error.message || ''"
    :home-text="$t('error.home')"
    :home-to="prefix"
    :kicker="kicker"
    :text="text"
    :title="title"
  />
</template>

<script>
import { langMixin } from '../utils/lang'

/** The error page: a not found, or any other error, with a way home. */
export default {
  mixins: [langMixin],

  props: {
    error: { type: Object, default: () => ({}) },
  },

  computed: {
    status: ({ error }) => Number(error.statusCode) || 500,
    notFound: ({ status }) => status === 404,
    kicker() {
      return this.notFound
        ? this.$t('error.notFoundKicker')
        : this.$t('error.kicker')
    },
    title() {
      return this.notFound
        ? this.$t('error.notFound')
        : this.$t('error.title', { status: this.status })
    },
    text() {
      return this.notFound
        ? this.$t('error.notFoundText')
        : this.$t('error.text')
    },
  },
}
</script>
