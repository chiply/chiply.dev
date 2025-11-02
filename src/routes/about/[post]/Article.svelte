<script lang="ts">
 import { createEventDispatcher } from "svelte";
 import { onMount } from "svelte";

 const dispatch = createEventDispatcher();
 let { post } = $props();
 let container;

 $effect(() => {
     if (post.querySelector("title") && !(post.querySelector("title").text === "my-svelte-project")) {
         const post_clone = post.cloneNode(true);

         // remove title
         // remove #table-of-contents
         const titleInContent = post_clone.querySelector("h1.title");
         if (titleInContent) titleInContent.remove();
         // remove #table-of-contents
         const tocInContent = post_clone.getElementById("table-of-contents");
         if (tocInContent) tocInContent.remove();
         // remove #tldr and #text-tldr
         const tldrInContent = post_clone.getElementById("outline-container-tldr");
         if (tldrInContent) tldrInContent.remove();
         // remove #footnotes
         const footnotesInContent = post_clone.getElementById("footnotes");
         if (footnotesInContent) footnotesInContent.remove();
         container.innerHTML = post_clone.getElementById("content").innerHTML;

         dispatch("mounted");

         const foldableDivs = document.querySelectorAll('[class^="outline-"]');
         foldableDivs.forEach((div) => {
             div.addEventListener("click", function () {
                 event.stopPropagation(); // Prevents the event from bubbling up to parent divs
                 this.classList.toggle("folded");
             });
         });

     };
 }
 );

 
</script>

<div bind:this={container} id="article"></div>

<style>
 #article {
     overflow-x: hidden;
     overflow-y: auto;
 }
</style>
