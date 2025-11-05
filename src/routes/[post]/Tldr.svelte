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
      let id = "";
      // empty headings
      if (entry.target.tagName.match(/^H[2-6]$/)) {
        id = entry.target.getAttribute("id") || "";

        const tldrLink = document.querySelector(
          `#tldr-container a[href="#${id}"]`,
        );
        const nextSibling = entry.target.nextElementSibling;
        if (tldrLink && !nextSibling) {
          const action = entry.intersectionRatio > 0 ? "add" : "remove";
          tldrLink.parentElement.classList[action]("active");

          // Scroll active link into view
          if (entry.intersectionRatio > 0) {
            tldrLink.scrollIntoView({
              behavior: "smooth",
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

        const tldrLink = document.querySelector(
          `#tldr-container a[href="#${id}"]`,
        );
        if (tldrLink) {
          const action = entry.intersectionRatio > 0 ? "add" : "remove";
          tldrLink.classList[action]("active");

          // Scroll active link into view
          if (entry.intersectionRatio > 0) {
            tldrLink.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback);

  const addObservers = () => {
    const headings = [
      ...j$(
        "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6",
      ),
    ];

    headings.forEach((heading) => observer.observe(heading));
  };

  $effect(() => {
    if (isWide) {
      const clone$ = j$(post).clone();
      container.innerHTML = clone$.find("#text-tldr").html();
      onMount(() => {
        addObservers();
      });
    }
  });
</script>

<div bind:this={container} id="tldr-container"></div>
