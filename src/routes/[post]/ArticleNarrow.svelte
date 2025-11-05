<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let post;

  let container;

  $: if (
    container &&
      post 
  ) {
    if (post.querySelector("title") && !(post.querySelector("title").text === "my-svelte-project")) {
      const post_clone = post.cloneNode(true);
      container.innerHTML = post_clone.getElementById("content").innerHTML;
      dispatch("mounted");

      const foldableDivs = document.querySelectorAll('[class^="outline-"]');
      foldableDivs.forEach((div) => {
        div.addEventListener("click", function () {
          event.stopPropagation(); // Prevents the event from bubbling up to parent divs
          this.classList.toggle("folded");
        });
      });

    }
  }
</script>

<div bind:this={container} id="article"></div>

<style>
  #article {
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
