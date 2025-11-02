<script>
  import { onMount } from "svelte";

  onMount(() => {
    const progressBar = document.getElementById("progressBar");

    const updateProgressBar = () => {
      const scrollTop =
            document.querySelector("#article").scrollTop || document.body.scrollTop;
      const scrollHeight =
            document.querySelector("#article").scrollHeight -
            document.querySelector("#article").clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      progressBar.style.width = `${scrollPercentage}%`;
    };

    // Initial call to set progress bar on page load
    updateProgressBar();

    // Add scroll event listener to update the progress bar
    document.querySelector("#article").addEventListener("scroll", updateProgressBar);
  });

</script>

<div id="progressBar"></div>

<style>
  div {
    background-color: #ccc;
     /* Initial width is 0% */
    width: 0%;
  }
</style>

