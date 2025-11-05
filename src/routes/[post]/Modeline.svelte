<script lang="ts">
  // imports
  import { onMount } from "svelte";
  import j$ from "jquery";

  // props and variables
  let { post, isWide } = $props();
  let container = $state();

  // defined functions
  const addSocials = (socials$, modeline) => {
    socials$.each((_, elem) => {
      const href = j$(elem).attr("href");
      if (href.includes("reddit.com")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-reddit" aria-hidden="true"></i></a>`;
      } else if (href.includes("linkedin.com")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin"></i></a>`;
      } else if (href.includes("twitter.com") || href.includes("x.com")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-x-twitter"></i></a>`;
      } else if (href.includes("news.ycombinator.com")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-hacker-news"></i></a>`;
      } else if (href.includes("mastodon")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-mastodon"></i></a>`;
      } else if (href.includes("youtube.com")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube"></i></a>`;
      } else if (href.includes("github.com") && href.includes("commits")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i></a>`;
      } else if (href.includes("github.com")) {
        modeline.innerHTML += `<a href="${href}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-code-commit"></i></a>`;
      }

    });
  };

  $effect(() => {
    // Clear previous content
    container.innerHTML = "";

    // Create modeline element
    const modeline = document.createElement("div");
    modeline.id = "modeline";

    // Append modeline to container
    container.appendChild(modeline);

    // insert content
    let clone$ = j$(post).clone();
    let socials$ = clone$.find("#outline-container-socials a");
    if (socials$.length === 0) {
      modeline.innerHTML = `<span>No socials provided</span>`;
      return;
    }
    addSocials(socials$, modeline);
    // add whitespace between icons
    // TODO why doesn't this work in CSS?
    modeline.querySelectorAll("a").forEach((a) => {
      a.style.margin = "0 0.2rem";
    });
  });
</script>

<div id="modeline-container" bind:this={container}></div>

<style>
  #modeline-container {
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    color: #ccc;
  }
</style>
