<template>
  <DruxtSite theme="umami">
    <template #default="{ props, regions }">
      <div>
        <UmamiStickyHeader v-if="regions.includes('header')">
          <!-- toggleable: false — the phone menu is a drawer, so the navbar
               owns no collapse. -->
          <DruxtBlockRegion
            v-bind="props.header"
            :wrapper="{
              class: ['masthead-wrapper'],
              component: 'b-navbar',
              propsData: { sticky: true, toggleable: false },
            }"
          />
        </UmamiStickyHeader>

        <DruxtBlockRegion
          v-if="regions.includes('banner_top')"
          v-bind="props.banner_top"
        />

        <!-- The one note in the editorial flow, and the front page is where
             it earns its place: the bands above are Drupal's block layout. -->
        <UmamiBand v-if="isFront" class="d-none d-md-block">
          <UmamiNote
            :code="blocksSnippet"
            :cta="$t('note.blocksCta')"
            href="https://druxtjs.org/modules/blocks"
            :kicker="$t('note.howThisPageWorks')"
            :title="$t('note.blocksTitle')"
            >{{ $t('note.blocksBody') }}</UmamiNote
          >
        </UmamiBand>

        <!-- v-if, not v-show: on the front page these should not be in the
             DOM at all. isHomePath is false at /en/ because the router's home
             path is /node, so the langcode roots are tested here too. -->
        <!-- Drupal has no breadcrumb or title for a route it does not know,
             so on a Nuxt-owned page this band would be an empty stripe. -->
        <!-- A node draws its own head under its photograph; a term draws its
             own band with the kicker and the count. -->
        <UmamiBand
          v-if="!isFront && isDrupalRoute && !ownsHead"
          ground="warm"
          :modifiers="['head']"
        >
          <DruxtBlockRegion
            v-if="regions.includes('breadcrumbs')"
            v-bind="props.breadcrumbs"
          />
          <DruxtBlockRegion
            v-if="regions.includes('page_title')"
            v-bind="props.page_title"
          />
        </UmamiBand>

        <!-- A page that draws its own head sits closer to the masthead. -->
        <UmamiBand :modifiers="ownsHead ? ['flush'] : []">
          <slot v-if="$slots.default" />
          <DruxtBlockRegion
            v-else-if="regions.includes('content')"
            v-bind="props.content"
          />
        </UmamiBand>

        <!-- Each block in this region brings its own band: the region holds
             the articles grid and the collection pills, on different
             grounds. -->
        <DruxtBlockRegion
          v-if="regions.includes('content_bottom')"
          v-bind="props.content_bottom"
        />

        <UmamiBand v-if="regions.includes('footer')" :modifiers="['footer']">
          <DruxtBlockRegion v-bind="props.footer" />
        </UmamiBand>

        <UmamiFooter v-if="regions.includes('bottom')">
          <DruxtBlockRegion v-bind="props.bottom" />
        </UmamiFooter>

        <AppMobileDrawer />
      </div>
    </template>
  </DruxtSite>
</template>

<script>
import { isFront } from '../utils/front'
import { langcodeOf } from '../utils/lang'

const SNIPPET = [
  "<span class='t'>&lt;DruxtBlockRegion</span>",
  "  <span class='a'>name</span>=<span class='v'>\"banner_top\"</span>",
  "  <span class='a'>theme</span>=<span class='v'>\"umami\"</span>",
  "<span class='t'>/&gt;</span>",
].join('\n')

/**
 * The page: DruxtSite's regions, laid out in the Umami chrome. Each region's
 * blocks render through the components in components/druxt/.
 */
export default {
  data: () => ({ blocksSnippet: SNIPPET }),

  /** The page's language on the html element, whichever page set the head. */
  head() {
    return { htmlAttrs: { lang: langcodeOf(this.$route.path) } }
  },

  computed: {
    /** The router resolved this path to something in Drupal. */
    isDrupalRoute() {
      return !!this.$store.state.druxtRouter.route.resolvedPath
    },

    ownsHead() {
      const { entity } = this.$store.state.druxtRouter.route
      return ['node', 'taxonomy_term'].includes((entity || {}).type)
    },

    isFront() {
      return isFront(this.$store.state.druxtRouter.route, this.$route.path)
    },
  },
}
</script>
