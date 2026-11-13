<script>
import Default from '#wrappers/DruxtEntityTaxonomyTermDefault'

export default {
  extends: Default,

  data: () => ({
    entityTypes: ['node--recipe'],
    field: 'field_recipe_category',
  }),
}
</script>
