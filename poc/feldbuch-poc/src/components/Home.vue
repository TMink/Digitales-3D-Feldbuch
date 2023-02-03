<template>
    <div id="wrapper">
        <Navigation/>
        <h1>Home Placeholder</h1>
    </div>
</template>

<script>
import Navigation from './Navigation.vue'

export default {
    name: 'Home',
    components: {
        Navigation
    }
}
</script>
<style scoped>
    h1 {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: black;
    }

    #wrapper {
        height: 100%;
    }
    
</style>
