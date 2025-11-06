<script lang="ts">
  // imports
  import { createEventDispatcher } from "svelte";
  import j$ from "jquery";
 import { goto } from "$app/navigation";

  // props and variables
  const dispatch = createEventDispatcher();
  let { post } = $props();
  let container;

  // define functions
  const removeSelectors = (clone$) => {
    for (let selector of [
      "#outline-container-socials",
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
    const container$ = j$(container);

    // override the onclick even on all a tags that have hrefs to
    // relative links, to get routing
    container$.find('a[href^="./"]').on("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      goto(href);
    });
    dispatch("mounted");
    j$(container).find('[class^="outline-"]').on("click", toggleFold);
  });
</script>

<div bind:this={container} id="article"></div>

<style>
  #article {
    overflow-x: hidden;
    overflow-y: auto;
    margin-botttom: 1rem;
    margin-top: 1rem;
  }
</style>
