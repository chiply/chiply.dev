<script lang="ts">
    // svelte imports
    import type { PageProps } from "./$types";

    // component imports
    import ToC from "./ToC.svelte";
    import Footnotes from "./Footnotes.svelte";
    import Article from "./Article.svelte";
    import ArticleNarrow from "./ArticleNarrow.svelte";
    import Tldr from "./Tldr.svelte";
    import Minimap from "./Minimap.svelte";
    import Navbar from "./Navbar.svelte";
    import Tags from "./Tags.svelte";
    import Bibliography from "./Bibliography.svelte";
    import ProgressBar from "./ProgressBar.svelte";
    import Graph from "./Graph.svelte";

    // detect if mobile
    let isWide = window.matchMedia("(min-width: 1000px)").matches;

    // tracking if article is mounted
    let articleMounted = $state(false);
    function handleArticleMounted() {
        articleMounted = true;
    }

    // data
    let { data }: PageProps = $props();
    const parser = new DOMParser();
    let post = $derived(
        parser.parseFromString(data.posts[data.postTitle], "text/html"),
    );
</script>

<main>
    {#if isWide === true}
        <div id="pane">
            <ProgressBar />
            <Navbar postTitle={data.postTitle} />
            <div id="article-info">
                <div id="left-sidebar">
                    {#if articleMounted}
                        <ToC {post} />
                        <Footnotes {post} />
                    {/if}
                </div>
                <Article {post} on:mounted={handleArticleMounted} />
                {#if articleMounted}
                    <div id="tags-and-tldr">
                        <Tags {post} />
                        <Tldr {post} />
                        <Graph />
                    </div>
                    <Minimap {post} />
                {/if}
            </div>
            {#if articleMounted}
                <Bibliography {post} />
            {/if}
            <div>modeline</div>
        </div>
    {/if}
    {#if isWide === false}
        <div id="pane">
            <div id="article-info">
                <ArticleNarrow
                    post={post}
                    on:mounted={handleArticleMounted}
                />
            </div>
        </div>
    {/if}
</main>

<style>
    @media (min-width: 1000px) {
        #pane {
            display: grid;
            grid-template-rows: 0.5% 4% 88.5% 4% 2%;
            height: 100vh;
            width: 100vw;
        }
    }
    @media (max-width: 1000px) {
        #pane {
            display: grid;
            grid-template-rows: 100%;
            height: 100vh;
            width: 100vw;
        }
    }

    @media (min-width: 1000px) {
        #article-info {
            display: grid;
            grid-template-columns: 18% 60% 14.5% 7.5%;
        }
    }

    @media (max-width: 1000px) {
        #article-info {
            display: grid;
            grid-template-columns: 100%;
        }
    }

    #article-info div {
        /* make the div scrollable */
        overflow: auto;
    }

    #left-sidebar {
        display: grid;
        grid-template-rows: 50% 50%;
    }

    #tags-and-tldr {
        display: grid;
        width: 100%;
        grid-template-rows: 10% 60% 30%;
    }
</style>
