<script lang="ts">
 import { goto } from "$app/navigation";
 import { onMount } from "svelte";
 let { postTitle } = $props();

 onMount(() => {
     const postInput = document.getElementById("post-input");

     postInput.addEventListener("change", async (event) => {
         postTitle = event.target.value;
         try {
             goto(`/${postTitle}`);
         } catch (error) {
             console.error("Error reading file synchronously:", error.message);
         }
     });
 });
</script>

<datalist id="posts">
    <option value="post0"></option>
    <option value="post1"></option>
</datalist>

<input id="post-input" type="text" list="posts" bind:value={postTitle} />

<style>
 #post-input {
   border: none;
   max-width: 100vw;
   text-align: left;
   padding-bottom: 0.6rem;
 }
 #post-input:focus {outline: none;}
</style>
