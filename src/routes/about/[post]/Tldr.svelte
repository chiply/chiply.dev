<script lang="ts">
    // imports
    import { onMount } from "svelte";
    let { post } = $props();
    let container;

    // insert content
    $effect(() => {
        const post_clone = post.cloneNode(true);
        container.innerHTML = post_clone.getElementById("text-tldr").innerHTML;

        var isMobile = window.matchMedia("(min-width: 1000px)").matches;

        if (isMobile) {
            const observerCallbackTldr = (entries) => {
                entries.forEach((entry) => {
                    let id = "";
                    // empty headings
                    if (entry.target.tagName.match(/^H[2-6]$/)) {
                        id = entry.target.getAttribute("id") || "";

                        const tldrLink = document.querySelector(
                            `#tldr-container a[href="#${id}"]`,
                        );
                        const nextSibling = entry.target.nextElementSibling;
                        if (tldrLink && !nextSibling) {
                            const action =
                                entry.intersectionRatio > 0 ? "add" : "remove";
                            tldrLink.parentElement.classList[action]("active");

                            // Scroll active link into view
                            if (entry.intersectionRatio > 0) {
                                tldrLink.scrollIntoView({
                                    behavior: "smooth",
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

                        const tldrLink = document.querySelector(
                            `#tldr-container a[href="#${id}"]`,
                        );
                        if (tldrLink) {
                            const action =
                                entry.intersectionRatio > 0 ? "add" : "remove";
                            tldrLink.classList[action]("active");

                            // Scroll active link into view
                            if (entry.intersectionRatio > 0) {
                                tldrLink.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }
                        }
                    }
                });
            };

            // Followable, scrollable tldr
            onMount(() => {
                const observer = new IntersectionObserver(observerCallbackTldr);

                // Collect all headings and outline divs
                const headings = [
                    ...document.querySelectorAll(
                        "#article div.outline-text-2, #article div.outline-text-3, #article div.outline-text-4, #article div.outline-text-5, #article div.outline-text-6",
                    ),
                ];

                headings.forEach((heading) => observer.observe(heading));
            });

            // Clickable TLDR links
            const clickTldrLink = function (event) {
                event.preventDefault();
                event.stopPropagation();
                const targetId = this.getAttribute("href").substring(1);
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
                    "#text-tldr a[href^='#']",
                );

                tocLinks.forEach((link) => {
                    link.addEventListener("click", clickTldrLink);
                });
            });
        }
    });
</script>

<div bind:this={container} id="tldr-container"></div>
