<script lang="ts">
  // imports
  import { onMount } from "svelte";
  import j$ from "jquery";

  // props and variables
  let { post, isWide } = $props();
  let container = $state();

  // defined functions
  const callback = (entries) => {
    entries.forEach((entry) => {
      // Check if target is an outline-text div
      var id = entry.target.getAttribute("id");

      var fnLink = document.querySelector(`#footnotes sup a[href="#${id}"]`);
      if (fnLink) {
        fnLink = fnLink.closest("sup").nextElementSibling.querySelector("p");
      }
      const fnLink1 = document.querySelector(`#footnotes sup a[href="#${id}"]`);
      if (fnLink) {
        const action = entry.intersectionRatio > 0 ? "add" : "remove";
        fnLink.classList[action]("active");
        fnLink1.classList[action]("active");

        // Scroll active link into view
        if (entry.intersectionRatio > 0) {
          fnLink.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback);

  const addObservers = () => {
    const headings = [...j$("#article sup a.footref").toArray()];
    headings.forEach((heading) => observer.observe(heading));
  };

  $effect(() => {
    if (isWide) {
      const clone$ = j$(post).clone();
      container.innerHTML = clone$.find("#footnotes").html();
      onMount(() => {
        addObservers();
      });
    }
  });
</script>

<div bind:this={container} id="footnotes"></div>

<style>
  #footnotes {
    margin: 1rem;
  }
</style>
