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
      // if entry is a span with class = tag
      if (entry.target.className.match(/tag/)) {
        const tldrLink = Array.from(
          document.querySelectorAll("#tag-container span"),
        ).filter((p) =>
          p.textContent.includes(`${entry.target.textContent}`),
        )[0];
        if (tldrLink) {
          const action = entry.intersectionRatio > 0 ? "add" : "remove";
          tldrLink.classList[action]("active");

          // Scroll active link into view
          if (entry.intersectionRatio > 0) {
            tldrLink.scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      }

      // if entry is a div with class outline-text-2 to outline-text-6
      if (
        entry.target.tagName === "DIV" &&
        entry.target.className.match(/outline-text-[2-6]/)
      ) {
        // get the tags in the previous sibling span with class tag
        const previousTagSpan = entry.target.previousElementSibling;
        const span = previousTagSpan.querySelectorAll("span.tag");

        span.forEach((span) => {
          const tldrLink = Array.from(
            document.querySelectorAll("#tag-container span"),
          ).filter((p) => p.textContent.includes(`${span.textContent}`))[0];
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
        });
      }
    });
  };

  const observer = new IntersectionObserver(callback);

  const addObserverers = () => {
    const headings = [
      ...j$("#article span.tag *"),
      ...j$(
        "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6",
      ),
    ];

    headings.forEach((heading) => observer.observe(heading));
  };

  $effect(() => {
    if (isWide) {
      container.innerHTML = "";
      // query the doc for all spans inside of spans with class "tag" and
      // insert the subspans into tag-container
      const tagSpans = post.querySelectorAll("#content span.tag > span");

      // collect unique tags
      const uniqueTags = new Set();
      tagSpans.forEach((span) => {
        uniqueTags.add(span.textContent);
      });

      // add tags to container
      uniqueTags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        container.appendChild(tagElement);
        container.appendChild(document.createTextNode(" "));
      });

      onMount(() => {
        addObserverers();
      });
    }
  });
</script>

<div bind:this={container} id="tag-container"></div>
