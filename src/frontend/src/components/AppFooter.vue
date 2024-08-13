<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 13.08.2024 12:28:13
 * Modified By: Julian Hardtung
 * 
 * Description: app footer of the fieldbook
 -->

<template>
    <v-footer app relativ style="padding: 0px; z-index: 3;">
        <v-row no-gutters>
            <v-col icon class="text-center pa-0">
                {{ new Date().getFullYear() }} — <strong>TH-Köln</strong>
                <v-btn  icon  
                        variant="text" 
                        href="https://www.th-koeln.de/informatik-und-ingenieurwissenschaften/fakultaet-fuer-informatik-und-ingenieurwissenschaften_2466.php" 
                        target="_blank"
                        >
                    <v-icon><v-img src="assets/logos/THCologne_Icon.png"></v-img></v-icon>
                </v-btn> 
                v{{ curVersion }}
              </v-col>
        </v-row>
    </v-footer>
</template>
  
<script>

import {version} from '../../package.json';

export default {
    name: 'AppFooter',
    data() {
      return {
        curVersion: "-"
      }
    },
    created() {
      this.curVersion = version
    },
}
</script>
  
<style></style>
  