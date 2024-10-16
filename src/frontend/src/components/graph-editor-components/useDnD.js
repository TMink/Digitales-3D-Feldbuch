/*
 * Created Date: 24.09.2024 14:53:58
 * Author: Tobias Mink
 * 
 * Last Modified: 03.10.2024 15:40:11
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'

let count = 0

function getDefaultLabel() {
  return `Neue Unit_${count++}`
}

/**
 * @returns {string} - A unique id.
 */
function getId() {
  return String(Date.now())
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  /**
   * The type of the node being dragged.
   */
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
  nodeDropped: ref(false),
}

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging, nodeDropped } = state;

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode, onNodeMouseEnter } = useVueFlow();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event, type, highestDefaultCount) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    count = highestDefaultCount++

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drag over event.
   *
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function onDragEnd() {
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    nodeDropped.value = true
    document.removeEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drop event.
   *
   * @param {DragEvent} event
   */
  function onDrop(event) {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getId()

    const newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
      data: null
    }

    switch( draggedType.value ) {
      case "deposit" :
        newNode.data = { 
          label: getDefaultLabel(), 
          description: null, 
          relations: [], 
          groupIDs: null, 
          volumeID: null, 
          findingID: null,
          nodeStyle: "notClicked_deposit",
          selected: false,
          styles: { 
            top_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;",
            bottom_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;",
            left_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;",
            right_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;"
          }, 
          validConnections: { 
            top_middle: true, 
            bottom_middle: true, 
            left_middle: true, 
            right_middle: true 
          }
        };
        break;
      case "interface":
        newNode.data = { 
          label: getDefaultLabel(), 
          description: null, 
          relations: [], 
          groupIDs: null, 
          surfaceID: null,
          nodeStyle: "notClicked_interface",
          selected: false,
          styles: {
            top_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-top-left-radius: 100%; border-top-right-radius: 100%;",
            bottom_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-bottom-right-radius: 100%;",
            left_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-top-left-radius: 100%;",
            right_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-right-radius: 100%; border-top-right-radius: 100%;"
          }, 
          validConnections: { 
            top_middle: true, 
            bottom_middle: true, 
            left_middle: true, 
            right_middle: true 
          }
        };
        break;
      default: 
    }

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
      }))

      off()
    })

    addNodes(newNode)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    nodeDropped,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}