<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 14:25:28
 * Modified By: Julian Hardtung
 * 
 * Description: app footer of the fieldbook
 -->

<template>
    <v-footer style="z-index: 1;" app>
        <v-row>
            <v-col icon class="text-center pa-0">
                {{ new Date().getFullYear() }} — <strong>TH-Köln</strong>
                <v-btn  icon 
                        class="ma-1" 
                        variant="text" 
                        href="https://www.th-koeln.de/informatik-und-ingenieurwissenschaften/fakultaet-fuer-informatik-und-ingenieurwissenschaften_2466.php" 
                        target="_blank"
                        >
                    <!-- <v-icon><v-img src="src/assets/logos/THCologne_Icon.png"></v-img></v-icon> -->
                    <v-icon><v-img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/TH_Koeln_Logo.svg"></v-img></v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-footer>
</template>
  
<script>
export default {
    name: 'AppFooter'
}
</script>
  
<style></style>
  