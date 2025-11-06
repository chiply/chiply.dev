<script>
  let { post, isWide } = $props();
  let container = $state();
  // define functions
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
  function minimap_update() {
    // Parameters
    const minimapWidth = document.body.clientWidth * 0.12;
    const scale = minimapWidth / document.querySelector("#article").scrollWidth;

    // Setup the minimap
    const minimap = document.getElementById("minimap");
    const minimapContent = document.getElementById("minimap-content");

    // Clone body content (shallow, not perfect for all apps)
    function cloneBodyContent() {
      if (document.querySelector(`#content-clone`)) {
        return;
      }

      const clone = post.cloneNode(true);

      const socialsInContent = clone.getElementById(
        "outline-container-socials",
      );
      if (socialsInContent) socialsInContent.remove();
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
      const viewportWidth = getAbsoluteWidth(articleDiv);
      const viewportHeight = getAbsoluteHeight(articleDiv);

      viewport.style.top = scrollTop * bodyScale + "px";
      viewport.style.left = scrollLeft * bodyScale + "px";
      viewport.style.width = viewportWidth * bodyScale + "px";
      viewport.style.height = viewportHeight * bodyScale + "px";
    }

    document
      .querySelector("#article")
      .addEventListener("scroll", updateViewport);

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

    function getAbsoluteHeight(el) {
      // Get the DOM Node if you pass in a string
      el = typeof el === "string" ? document.querySelector(el) : el;

      var styles = window.getComputedStyle(el);
      var margin =
        parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

      return Math.ceil(el.offsetHeight + margin);
    }

    function getAbsoluteWidth(el) {
      // Get the DOM Node if you pass in a string
      el = typeof el === "string" ? document.querySelector(el) : el;

      var styles = window.getComputedStyle(el);
      var margin =
        parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

      return Math.ceil(el.offsetWidth + margin);
    }

    // Clicking on minimap scrolls page
    minimap.addEventListener("click", function (e) {
      const articleDiv = document.querySelector("#article");
      const articleWidth = getAbsoluteWidth(articleDiv);
      const articleHeight = getAbsoluteHeight(articleDiv);

      // TODO -- bad design as this makes it hard to rearrange
      // everything
      const progressBarDiv = document.getElementById("progressBar");
      const navBarDiv = document.getElementById("post-input");
      const bibliographyDiv = document.getElementById("bibliography-container");
      const socialsDiv = document.getElementById("modeline-container");
      const progressBarHeight = getAbsoluteHeight(progressBarDiv);
      const navBarHeight = getAbsoluteHeight(navBarDiv);
      const bibliographyHeight = getAbsoluteHeight(bibliographyDiv);
      const socialsHeight = getAbsoluteHeight(socialsDiv);

      const minimapWidth = articleWidth * 0.12; // 20% of body width
      const scale = minimapWidth / articleWidth;

      const minimap = document.getElementById("minimap-content");
      const rect = minimap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const scrollX = x / scale;
      const scrollY =
        y / scale + progressBarHeight + navBarHeight + socialsHeight;

      articleDiv.scrollTo({
        top: scrollY - articleHeight / 2,
        left: scrollX - articleWidth / 2,
        behavior: "smooth",
        block: "nearest",
      });
    });

    //// Make unobtrusive
    //minimapContainer = document.getElementById("minimap-container");
  }

  const observer = new IntersectionObserver(observerCallbackMinimap);

  const addObservers = () => {
    // Collect all headings and outline divs
    const headings = [
      ...document.querySelectorAll(
        "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6",
      ),
    ];

    headings.forEach((heading) => observer.observe(heading));
  };

  $effect(() => {
    if (isWide) {
      minimap_update();
      addObservers();
    }
  });

  window.addEventListener("resize", function () {
    minimap_update();
  });
</script>

<div id="minimap-container" class="desktop-only">
  <div id="minimap">
    <div id="minimap-viewport"></div>
    <div bind:this={container} id="minimap-content"></div>
  </div>
</div>
