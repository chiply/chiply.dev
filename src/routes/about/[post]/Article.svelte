<script lang="ts">
  // imports
  import { createEventDispatcher } from "svelte";
  import j$ from "jquery";

  // props and variables
  const dispatch = createEventDispatcher();
  let { post } = $props();
  let container;

  // define functions
  const removeSelectors = (clone$) => {
    for (let selector of [
      "h1.title",
      "#table-of-contents",
      "#outline-container-tldr",
      "#footnotes",
    ]) {
      clone$.find(selector).remove();
    }
    return clone$;
  };

  const toggleFold = (e) => {
    e.stopPropagation();
    // toggle class on the clicked element folded
    j$(e.currentTarget).toggleClass("folded");
  };

  $effect(() => {
    let clone$ = j$(post).clone();
    clone$ = removeSelectors(clone$);
    container.innerHTML = clone$.find("#content").html();
    dispatch("mounted");
    j$(container).find('[class^="outline-"]').on("click", toggleFold);
  });
</script>

<div bind:this={container} id="article"></div>

<style>
  #article {
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
