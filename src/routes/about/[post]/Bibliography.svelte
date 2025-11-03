<script lang="ts">
  // imports
  import { onMount } from "svelte";
  import j$ from "jquery";

  // props and variables
  let { post, isWide } = $props();
  let container = $state();

  const callback = (entries) => {
    entries.forEach((entry) => {
      // if href does not contain http, skip
      if (!entry.target.getAttribute("href").includes("http")) {
        return;
      }

      var id = entry.target.getAttribute("href");

      var fnLink = document.querySelector(
        `#bibliography-container a[href="${id}"]`,
      );
      if (fnLink) {
        const action = entry.intersectionRatio > 0 ? "add" : "remove";
        fnLink.classList[action]("active");

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
    const headings = [...document.querySelectorAll("#article a")];

    headings.forEach((heading) => observer.observe(heading));
  };

  $effect(() => {
    if (isWide) {
      // query all a tags with href containing http
      const bibLinks = post.querySelectorAll('#content a[href*="http"]');
      // add bib links to container
      bibLinks.forEach((link, index) => {
        const bibElement = document.createElement("span");
        bibElement.className = "bibliography-entry";
        bibElement.innerHTML = `${link.outerHTML} `;
        container.appendChild(bibElement);
      });

      onMount(() => {
        addObservers();
      });
    }
  });
</script>

<div bind:this={container} id="bibliography-container"></div>

<style>
  #bibliography-container {
    overflow-y: auto;
  }
</style>
