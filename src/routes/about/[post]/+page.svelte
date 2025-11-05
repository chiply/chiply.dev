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
  import Modeline from "./Modeline.svelte";
  //import Graph from "./Graph.svelte";

  // parser for HTML strings
  const parser = new DOMParser();

  // detect if mobile
  let isWide = $state(window.matchMedia("(min-width: 1000px)").matches);

  // tracking if article is mounted
  let articleMounted = $state(false);
  function handleArticleMounted() {
    articleMounted = true;
  }

  // data
  let { data }: PageProps = $props();
  let post = $derived(
    parser.parseFromString(data.posts[data.postTitle], "text/html"),
  );
</script>

<main>
  {#if isWide === true}
    <div id="pane">
      <ProgressBar />
      <div id="navbar-container">
        <span id="home-button"><a href="../"><i class="fa-solid fa-house"></i></a></span>
        <Navbar postTitle={data.postTitle} />
      </div>
      <div id="article-info">
        <div id="left-sidebar">
          {#if articleMounted}
            <ToC {post} {isWide} />
            <Footnotes {post} {isWide} />
          {/if}
        </div>
        <Article {post} on:mounted={handleArticleMounted} />
        <div id="tags-and-tldr">
          {#if articleMounted}
            <Tags {post} {isWide} />
            <Tldr {post} {isWide} />
            <!-- <Graph /> -->
          {/if}
        </div>
        {#if articleMounted}
          <Minimap {post} {isWide} />
        {/if}
      </div>
      {#if articleMounted}
        <Bibliography {post} {isWide} />
      {/if}
      <Modeline {post} {isWide} />
    </div>
  {/if}

  {#if isWide === false}
    <div id="pane">
      <div id="article-info">
        <ArticleNarrow {post} on:mounted={handleArticleMounted} />
      </div>
      <Modeline {post} {isWide} />
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
      grid-template-rows: 95% 5%;
      height: 100vh;
      width: 100vw;
    }
  }

  @media (min-width: 1000px) {
    #navbar-container {
      display: grid;
      grid-template-columns: 3% 97%;
    }
  }

  @media (max-width: 1000px) {
    #navbar-container {
      display: grid;
      grid-template-columns: 100%;
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
    grid-template-rows: 10% 90%;
  }

  #home-button {
    text-align: left;
    padding-top: 0.5rem;
    font-size: 1.5rem;
  }
</style>
