<template>

    <div id="view">
        <h1>3D-View Placeholder</h1>
    </div>

</template>
  
<script>
    export default {
        name: '3dview'
    }
</script>
  
<style>
    h1 {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
    }

    #view {
        height: 100%;
        background-color: #0C1726;
    }
</style>
  