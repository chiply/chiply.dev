<script lang="ts">
 // imports
 import { onMount } from "svelte";
 let { post } = $props();
 let container;

 // insert content
 $effect(() => {
     const post_clone = post.cloneNode(true);
     container.innerHTML = post_clone.getElementById("table-of-contents").innerHTML;

     // Followable, scrollable table of contents
     var isMobile = window.matchMedia("(min-width: 1000px)").matches;

     if (isMobile) {
         const observerCallbackToC = (entries) => {
             entries.forEach((entry) => {
                 let id = "";
                 // empty headings
                 if (entry.target.tagName.match(/^H[2-6]$/)) {
                     id = entry.target.getAttribute("id") || "";

                     const tocLink = document.querySelector(
                         `#text-table-of-contents a[href="#${id}"]`,
                     );
                     const nextSibling = entry.target.nextElementSibling;
                     if (tocLink && !nextSibling) {
                         const action =
                             entry.intersectionRatio > 0 ? "add" : "remove";
                         tocLink.parentElement.classList[action]("active");

                         // Scroll active link into view
                         if (entry.intersectionRatio > 0) {
                             tocLink.scrollIntoView({
                                 behavior: "smooth",
                                 block: "nearest",
                             });
                         }
                     }
                 }

                 // Check if target is an outline-text div
                 if (
                     entry.target.tagName === "DIV" &&
                     entry.target.className.match(/outline-text-[2-6]/)
                 ) {
                     id =
                         entry.target.previousElementSibling?.getAttribute(
                             "id",
                         ) || "";

                     const tocLink = document.querySelector(
                         `#text-table-of-contents a[href="#${id}"]`,
                     );
                     if (tocLink) {
                         const action =
                             entry.intersectionRatio > 0 ? "add" : "remove";
                         tocLink.parentElement.classList[action]("active");

                         // Scroll active link into view
                         if (entry.intersectionRatio > 0) {
                             tocLink.scrollIntoView({
                                 behavior: "smooth",
                                 block: "center",
                             });
                         }
                     }
                 }
             });
         };

         // Followable, scrollable table of contents
         const observer = new IntersectionObserver(observerCallbackToC);

         onMount(() => {
             // Collect all headings and outline divs
             const headings = [
                 ...document.querySelectorAll(
                     "#article h2[id], #article h3[id], #article h4[id], #article h5[id], #article h6[id]",
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

<div bind:this={container} id="table-of-contents"></div>
