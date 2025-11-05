<script lang="ts">
  // imports
  import { onMount } from "svelte";
  import j$ from "jquery";

  // props and variables
  let { post, isWide } = $props();
  let container = $state();

  // define functions
  const callback = (entries) => {
    entries.forEach((entry) => {
      let id = "";
      // empty headings
      if (entry.target.tagName.match(/^H[2-6]$/)) {
        id = entry.target.getAttribute("id") || "";

        const tocLink = document.querySelector(
          `#text-table-of-contents a[href="#${id}"]`,
        );
        const nextSibling = entry.target.nextElementSibling;
        if (tocLink && !nextSibling) {
          const action = entry.intersectionRatio > 0 ? "add" : "remove";
          tocLink.parentElement.classList[action]("active");

          // Scroll active link into view
          if (entry.intersectionRatio > 0) {
            tocLink.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }
      }

      // Check if target is an outline-text div
      if (
        entry.target.tagName === "DIV" &&
        entry.target.className.match(/outline-text-[2-6]/)
      ) {
        id = entry.target.previousElementSibling?.getAttribute("id") || "";

        const tocLink = document.querySelector(
          `#text-table-of-contents a[href="#${id}"]`,
        );
        if (tocLink) {
          const action = entry.intersectionRatio > 0 ? "add" : "remove";
          tocLink.parentElement.classList[action]("active");

          // Scroll active link into view
          if (entry.intersectionRatio > 0) {
            tocLink.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback);

  const addOObservers = () => {
    // Followable, scrollable table of contents

    // NOTE removed onMount here
    // Collect all headings and outline divs
    // TODO make these more concise using jquery syntax
    const articleHeaderSelector =
      "#article h2[id], #article h3[id], #article h4[id], #article h5[id], #article h6[id]";
    const outlineHeaderSelector =
      "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6";
    const articleHeaders = j$(articleHeaderSelector).toArray();
    const outlineHeaders = j$(outlineHeaderSelector).toArray();
    const headings = [...articleHeaders, ...outlineHeaders];

    headings.forEach((heading) => observer.observe(heading));
  };

  const removeSelectors = (clone$) => {
    for (let selector of [
  'a[href="#tldr"]',
  'a[href="#socials"]'
    ]) {
      clone$.find(selector).parent().remove();
    }
    return clone$;
  };

  $effect(() => {
    if (isWide) {
      let clone$ = j$(post).clone();
      clone$ = removeSelectors(clone$);
      container.innerHTML = clone$.find("#table-of-contents").html();
      onMount(() => {
        addOObservers();
      });
    }
  });
</script>

<div bind:this={container} id="table-of-contents"></div>
