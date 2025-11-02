<script>
  import { onMount } from "svelte";
     let { post } = $props();


  $effect(() => {
    // query the doc for all spans inside of spans with class "tag" and
    // insert the subspans into tag-container
    const tagContainer = document.getElementById("tag-container");
      tagContainer.innerHTML = "";

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
      // clear tagContainer
      tagContainer.appendChild(tagElement);
      // add space between tags
      tagContainer.appendChild(document.createTextNode(" "));
    });

  var isMobile = window.matchMedia("(min-width: 1000px)").matches;


  if (isMobile) {
    const observerCallbackTldr = (entries) => {
      entries.forEach((entry) => {
        let id = "";
        // empty headings
        // if entry is a span with class = tag
        if (entry.target.className.match(/tag/)) {
          const tldrLink = Array.from(
            document.querySelectorAll('#tag-container span'))
                .filter(p => 
                  p.textContent.includes(`${entry.target.textContent}`))[0];
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
              document.querySelectorAll('#tag-container span'))
                  .filter(p => 
                    p.textContent.includes(`${span.textContent}`))[0];
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
    

    // Followable, scrollable tldr
    onMount(() => {
      const observer = new IntersectionObserver(observerCallbackTldr);

      // Collect all headings and outline divs
      const headings = [
        ...document.querySelectorAll(
          "#article span.tag *"
        ),
        ...document.querySelectorAll(
          "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6",
        ),
      ];

      headings.forEach((heading) => observer.observe(heading));
    });
  }
  });
  

</script>

<div id="tag-container"></div>
