<script>
  import { onMount } from "svelte";
  let { post } = $props();

  $effect(() => {
    // query all a tags with href containing http
    const bibContainer = document.getElementById("bibliography-container");
    bibContainer.innerHTML = "";

    const bibLinks = post.querySelectorAll(
      '#content a[href*="http"]'
    );
    // add bib links to container
    bibLinks.forEach((link, index) => {
      const bibElement = document.createElement("span");
      bibElement.className = "bibliography-entry";
      bibElement.innerHTML = `${
        link.outerHTML
      } `;
      bibContainer.appendChild(bibElement);
    });
    // Follawable footnotes
  var isMobile = window.matchMedia("(min-width: 1000px)").matches;

  if (isMobile) {

    // Followable, scrollable footnotes
    onMount(() => {

    const observerCallbackFootnotes = (entries) => {
      entries.forEach((entry) => {
        // if href does not contain http, skip
        if (!entry.target.getAttribute("href").includes("http")) {
          return;
        }

        var id = entry.target.getAttribute("href");

        var fnLink = document
          .querySelector(`#bibliography-container a[href="${id}"]`)
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
      
      const observer = new IntersectionObserver(observerCallbackFootnotes);

      // Collect all headings and outline divs
      const headings = [...document.querySelectorAll("#article a")];

      headings.forEach((heading) => observer.observe(heading));
    });
  }
  });


  

</script>


<div id="bibliography-container"></div>

<style>
  #bibliography-container {
  overflow-y: auto;
  }

</style>
