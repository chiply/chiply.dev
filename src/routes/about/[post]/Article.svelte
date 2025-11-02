<script lang="ts">
 import { createEventDispatcher } from "svelte";
 import { onMount } from "svelte";
 import j$ from "jquery";

 const dispatch = createEventDispatcher();
 let { post } = $props();
 let container;

 $effect(() => {
     if (post.querySelector("title") && !(post.querySelector("title").text === "my-svelte-project")) {
         const clone = j$(post.cloneNode(true));
         const toRemove = ["h1.title", "#table-of-contents", "#outline-container-tldr", "#footnotes"];

         for (const selector of toRemove) {
             clone.find(selector).remove();
         }

         container.innerHTML = clone.find("#content").html();
         dispatch("mounted");

         const attachFoldableDivs = () => {
             div.addEventListener("click", function () {
                 event.stopPropagation(); // Prevents the event from bubbling up to parent divs
                 this.classList.toggle("folded");
             });
         };

         j$('[class^="outline-"]').on('click', function (event) {
             event.stopPropagation(); // Prevents the event from bubbling up to parent divs
             j$(this).toggleClass("folded");
         });
     };
 });
</script>

<div bind:this={container} id="article"></div>

<style>
 #article {
     overflow-x: hidden;
     overflow-y: auto;
 }
</style>
