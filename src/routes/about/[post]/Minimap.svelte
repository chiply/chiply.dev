<script>
  // LEFTOFF getting the minimap sizing to work properly
  var isMobile = window.matchMedia("(min-width: 1000px)").matches;
  let { post } = $props();
  let container;

  if (isMobile) {
    const observerCallbackMinimap = (entries) => {
      entries.forEach((entry) => {

        let id = "";
        // Check if target is an outline-text div
        id = entry.target.getAttribute("id");

        id = CSS.escape(id);
        const elementLink = document.querySelector(`#minimap #${id}`);
        if (elementLink) {
          if (entry.intersectionRatio > 0) {
            elementLink.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      });
    };

    // minimap
    function minimap_update(called) {
      // Parameters
      const minimapWidth = document.body.clientWidth * 0.12;
      const scale =
            minimapWidth / document.querySelector("#article").scrollWidth;

      // Setup the minimap
      const minimap = document.getElementById("minimap");
      const minimapContent = document.getElementById("minimap-content");

      // Clone body content (shallow, not perfect for all apps)
      function cloneBodyContent() {
        if (document.querySelector(`#content-clone`)) {
          return;
        }

        const clone = post.cloneNode(true);

        // remove titlekju

        const titleInContent = clone.querySelector("h1.title");
        if (titleInContent) titleInContent.remove();
        // remove #table-of-contents
        const tocInContent = clone.getElementById("table-of-contents");
        if (tocInContent) tocInContent.remove();
        // remove #tldr and #text-tldr
        const tldrInContent = clone.getElementById("outline-container-tldr");
        if (tldrInContent) tldrInContent.remove();
        // remove #footnotes
        const footnotesInContent = clone.getElementById("footnotes");
        if (footnotesInContent) footnotesInContent.remove();
        


        // change id of the clone node to content-clone
        clone.id = "content-clone";


        // set the margins of the clone to 0
        //clone.style.margin = "0";
        // Remove the minimap itself from the clone
        const mmc = clone.querySelector("#minimap-container");
        if (mmc) mmc.remove();
        container.innerHTML = clone.getElementById("content").innerHTML;
        //minimapContent.innerHTML = clone.innerHTML;
        // Style adjustments for minimap
        minimapContent.style.transform = `scale(${scale})`;
        minimapContent.style.width = document.body.scrollWidth + "px";
        minimapContent.style.height = document.body.scrollHeight + "px";
      }

      // Viewport rectangle
      const viewport = document.getElementById("minimap-viewport");

      function updateViewport() {
        const bodyScale =
              (document.body.clientWidth * 0.12) / document.body.scrollWidth;
        const articleDiv = document.querySelector("#article");
        const scrollTop = articleDiv.scrollTop;
        const scrollLeft = articleDiv.scrollLeft;
        const viewportWidth = articleDiv.clientWidth;
        const viewportHeight = articleDiv.clientHeight;

        viewport.style.top = scrollTop * bodyScale + "px";
        viewport.style.left = scrollLeft * bodyScale + "px";
        viewport.style.width = viewportWidth * bodyScale + "px";
        viewport.style.height = viewportHeight * bodyScale + "px";
      }

      document.querySelector("#article").addEventListener("scroll", updateViewport);

      // Style fired up on window resize (and periodically for dynamic content)
      function updateContentScale() {
        const realScale =
              (document.body.clientWidth * 0.12) / document.body.scrollWidth;
        minimapContent.style.transform = `scale(${realScale})`;
        minimapContent.style.width = document.body.scrollWidth + "px";
        minimapContent.style.height = document.body.scrollHeight + "px";
        updateViewport();
      }

      addEventListener("resize", updateContentScale);

      cloneBodyContent();
      updateContentScale();

      // Clicking on minimap scrolls page
      minimap.addEventListener("click", function (e) {
        const articleDiv = document.querySelector("#article");
        const minimapWidth = articleDiv.clientWidth * 0.12; // 20% of body width
        const scale = minimapWidth / articleDiv.clientWidth;

        const minimap = document.getElementById("minimap-content");
        const rect = minimap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const scrollX = x / scale;
        const scrollY = y / scale;

        articleDiv.scrollTo({
          top: scrollY - articleDiv.clientHeight / 2,
          left: scrollX - articleDiv.clientWidth / 2,
          behavior: "smooth",
          block: "nearest",
        });

      });

      //// Make unobtrusive
      //minimapContainer = document.getElementById("minimap-container");
    }

    $effect(() => {
      minimap_update(false);
      const observer = new IntersectionObserver(observerCallbackMinimap);

      // Collect all headings and outline divs
      const headings = [
        ...document.querySelectorAll(
          "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6",
        ),
      ];

      headings.forEach((heading) => observer.observe(heading));
    });

    window.addEventListener("resize", function () {
      minimap_update(true);
    });

  }

</script>

<div id="minimap-container" class="desktop-only">
  <div id="minimap">
    <div id="minimap-viewport"></div>
    <div bind:this={container} id="minimap-content"></div>
  </div>
</div>
