<script lang="ts">
    // imports
    import { onMount } from "svelte";

    let { post } = $props();
    let container;

    // insert content
    $effect(() => {
        const post_clone = post.cloneNode(true);
        container.innerHTML = post_clone.getElementById("footnotes").innerHTML;

        // Follawable footnotes
        var isMobile = window.matchMedia("(min-width: 1000px)").matches;

        if (isMobile) {
            // Followable, scrollable footnotes
            onMount(() => {
                const observerCallbackFootnotes = (entries) => {
                    entries.forEach((entry) => {
                        // Check if target is an outline-text div
                        var id = entry.target.getAttribute("id");

                        var fnLink = document.querySelector(
                            `#footnotes sup a[href="#${id}"]`,
                        );
                        if (fnLink) {
                            fnLink = fnLink
                                .closest("sup")
                                .nextElementSibling.querySelector("p");
                        }
                        const fnLink1 = document.querySelector(
                            `#footnotes sup a[href="#${id}"]`,
                        );
                        if (fnLink) {
                            const action =
                                entry.intersectionRatio > 0 ? "add" : "remove";
                            fnLink.classList[action]("active");
                            fnLink1.classList[action]("active");

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

                const observer = new IntersectionObserver(
                    observerCallbackFootnotes,
                );

                // Collect all headings and outline divs
                const headings = [
                    ...document.querySelectorAll("#article sup a.footref"),
                ];

                headings.forEach((heading) => observer.observe(heading));
            });

            // Clickable Footnotes
            const clickFootnoteLink = function (event) {
                event.preventDefault();
                var targetId = this.getAttribute("href").substring(1);
                targetId = CSS.escape(targetId);
                const elements = document.querySelectorAll(`#${targetId}`);
                const targetElement = Array.from(elements).filter(
                    (el) => !el.closest("#content-clone"),
                )[0];
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            };

            onMount(() => {
                const tocLinks = document.querySelectorAll(
                    "#footnotes a[href^='#']",
                );

                tocLinks.forEach((link) => {
                    link.addEventListener("click", clickFootnoteLink);
                });
            });
        }
    });
</script>

<div bind:this={container} id="footnotes"></div>
