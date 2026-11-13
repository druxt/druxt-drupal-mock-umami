<script>
import Default from '#wrappers/DruxtEntityTaxonomyTermDefault'

export default {
  extends: Default,

  data: () => ({
    entityTypes: ['node--article', 'node--recipe'],
    field: 'field_tags',
  }),
}
</script>
