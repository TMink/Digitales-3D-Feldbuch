<!--
 Created Date: 28.09.2024 13:33:40
 Author: Tobias Mink
 
 Last Modified: 28.09.2024 14:43:35
 Modified By: Tobias Mink
 
 Description: 
 -->

 <script setup>
 import { BaseEdge, getBezierPath, getSmoothStepPath } from '@vue-flow/core'
 import { computed } from 'vue'
 
 const props = defineProps({
   id: {
     type: String,
     required: true,
   },
   sourceX: {
     type: Number,
     required: true,
   },
   sourceY: {
     type: Number,
     required: true,
   },
   targetX: {
     type: Number,
     required: true,
   },
   targetY: {
     type: Number,
     required: true,
   },
   sourcePosition: {
     type: String,
     required: true,
   },
   targetPosition: {
     type: String,
     required: true,
   },
   data: {
     type: Object,
     required: false,
   },
   markerEnd: {
     type: String,
     required: false,
   },
   style: {
     type: Object,
     required: false,
   },
 })
 
 const path = computed(() => getSmoothStepPath(props))
 </script>
 
 <script>
 export default {
   inheritAttrs: false,
 }
 </script>
 
 <template>
   <BaseEdge
     :id="id"
     :style="style"
     :path="path[0]"
     :marker-start="markerEnd"
     :label="data.text"
     :label-x="path[1]"
     :label-y="path[2]"
     :label-style="{ fill: 'white' }"
     :label-show-bg="true"
     :label-bg-style="{ fill: 'blue', height: '30px' }"
     :label-bg-padding="[2, 4]"
     :label-bg-border-radius="2"
   />
 </template>

 <style>

 
</style>