<template>
    <canvas id="backgroundCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas id="fieldbookCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>

<script>
import { defineComponent, vModelDynamic } from 'vue'

export default defineComponent({
    name: 'FieldbookDrawingCanvas',
    props: {
        canvasWidth: {
            type: Number,
            default: 1200
        },
        canvasHeight: {
            type: Number,
            default: 800
        },
        lineWidth: {
            type: Number,
            default: 3,
        },
        color: {
            type: String,
            default: "#000",
        },
        mode: {
            type: String,
            default: "none"
        },
        fontStyle: {
            type: String,
            default: "20px Arial"
        }
    },
    data() {
        return {
            backgroundImage: null,
            fieldbookContext: null,
            backgroundContext: null,
            fieldbookCanvas: null,
            backgroundCanvas: null,
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            width: this.canvasWidth,
            height: this.canvasHeight,
            canvasStates: [],
            canvasIndex: -1,
        }
    },
    mounted() {
        var vm = this;
        vm.fieldbookCanvas = document.getElementById("fieldbookCanvas");
        vm.fieldbookContext = vm.fieldbookCanvas.getContext('2d', { willReadFrequently: true });
        vm.fieldbookContext.imageSmoothingEnabled = true;
        vm.fieldbookCanvas.addEventListener('mousemove', (event) => {
            vm.drawing(event);
        })
        vm.fieldbookCanvas.addEventListener('touchmove', (event) => {
            vm.drawingTouch(event);
        })
        vm.fieldbookCanvas.addEventListener('mousedown', (event) => {
            vm.startDrawing(event);
        })
        vm.fieldbookCanvas.addEventListener('mouseleave', () => {
            vm.endDrawing();
        })
        vm.fieldbookCanvas.addEventListener('touchstart', (event) => {
            vm.startDrawingTouch(event);
        })
        vm.fieldbookCanvas.addEventListener('touchend', (event) => {
            vm.endDrawing();
        }, { passive: true })
        vm.fieldbookCanvas.addEventListener('mouseup', () => {
            vm.endDrawing();
        })
        vm.backgroundCanvas = document.getElementById("backgroundCanvas");
        vm.backgroundContext = vm.backgroundCanvas.getContext("2d");
        vm.canvasStates[-1] = vm.fieldbookContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    },
    methods: {
        addBackgroundImage(imageSrc, imageWidth, imageHeight) {
            var image = new Image();
            image.src = imageSrc;
            var vm = this;

            image.onload = function () {
                vm.backgroundContext.clearRect(0, 0, imageWidth, imageHeight);
                vm.backgroundContext.drawImage(image, 0, 0, imageWidth, imageHeight);
            }
        },

        startDrawing(e) {
            this.fieldbookContext.lineWidth = this.lineWidth;
            this.fieldbookContext.lineJoin = 'miter';
            this.fieldbookContext.lineCap = 'round';
            this.fieldbookContext.strokeStyle = this.color;
            this.fieldbookContext.fillStyle = this.color;
            this.fieldbookContext.font = this.fontStyle;
            if (this.mode === "text") {
                this.addInput(e);
            }
            else {
                this.isDrawing = true;
                [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
                this.fieldbookContext.beginPath();
                this.fieldbookContext.moveTo(this.lastX, this.lastY);
            }
        },

        startDrawingTouch(e) {
            this.isDrawing = true;
            this.fieldbookContext.lineWidth = this.lineWidth;
            this.fieldbookContext.lineJoin = 'round';
            this.fieldbookContext.lineCap = 'round';
            const dim = this.fieldbookCanvas.getBoundingClientRect();
            [this.lastX, this.lastY] = [e.changedTouches[0].clientX - dim.left, e.changedTouches[0].clientY - dim.top];
            this.fieldbookContext.beginPath();
            this.fieldbookContext.moveTo(this.lastX, this.lastY);
        },

        drawingTouch(e) {
            if (!this.isDrawing) return;
            const dim = this.fieldbookCanvas.getBoundingClientRect();
            var currentX = e.changedTouches[0].clientX - dim.left;
            var currentY = e.changedTouches[0].clientY - dim.top;
            var cpX = (currentX + this.lastX) / 2;
            var cpY = (currentY + this.lastY) / 2;
            if (this.mode === "pen" || this.mode === "eraser") {
                this.fieldbookContext.globalCompositeOperation = this.mode === "eraser" ? 'destination-out' : 'source-over';
                this.fieldbookContext.quadraticCurveTo(this.lastX, this.lastY, cpX, cpY);
                this.fieldbookContext.stroke();
            }
            this.lastX = currentX;
            this.lastY = currentY;
        },

        drawing(e) {
            if (!this.isDrawing) return;
            var currentX = e.offsetX;
            var currentY = e.offsetY;
            var cpX = (currentX + this.lastX) / 2;
            var cpY = (currentY + this.lastY) / 2;
            if (this.mode === "pen" || this.mode === "eraser") {
                this.fieldbookContext.globalCompositeOperation = this.mode === "eraser" ? 'destination-out' : 'source-over';
                this.fieldbookContext.quadraticCurveTo(this.lastX, this.lastY, cpX, cpY);
                this.fieldbookContext.stroke();
            }
            this.lastX = currentX;
            this.lastY = currentY;
        },

        endDrawing() {
            this.isDrawing = false;
            this.fieldbookContext.closePath();
            this.addState();
        },

        addState() {
            this.canvasIndex += 1;
            this.canvasStates[this.canvasIndex] = this.fieldbookContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
            if (this.canvasStates.length - this.canvasIndex > 1) {
                this.removeFromIndex(this.canvasStates, this.canvasIndex);
            }
        },

        removeFromIndex(array, index) {
            if (index >= 0 && index < array.length) {
                array.splice(index + 1, array.length - index);
            } else {
                console.error("Invalid Index");
            }
        },

        clearCanvas() {
            this.fieldbookContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.canvasStates = [];
            this.canvasIndex = -1;
        },


        undo() {
            if (this.canvasIndex >= 0) {
                this.canvasIndex -= 1;
                this.fieldbookContext.putImageData(this.canvasStates[this.canvasIndex], 0, 0);
            }
        },

        redo() {
            if (this.canvasIndex < this.canvasStates.length - 1) {
                this.canvasIndex += 1;
                this.fieldbookContext.putImageData(this.canvasStates[this.canvasIndex], 0, 0);
            }
        },

        addInput(e) {
            var textarea = document.createElement('textarea');
            var vm = this;

            textarea.style.position = 'fixed';
            textarea.style.left = e.clientX + 'px';
            textarea.style.top = e.clientY + 'px';
            textarea.style.color = vm.color;
            textarea.style.border = "4px solid #27303d";
            textarea.style.borderRadius = "15px";
            textarea.style.padding = "10px";
            textarea.style.font = vm.fontStyle;

            textarea.addEventListener('focus', function () {
                this.style.border = "4px solid #27303d"
                this.style.borderRadius = "15px";
            });

            document.body.appendChild(textarea);

            textarea.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    drawText(textarea, vm, e);
                }
            });

            /**
       * Prints the value of the inputfield on the cancas and deletes the input-fields
       * 
       * @param {*} Input Inputfield containing the string to be printed
       * @param {*} vm this-Instance of the PlaceForm-Component 
       * */
            async function drawText(input, vm, e) {
                if (input.value != "") {
                    await vm.fieldbookContext.fillText(input.value, e.offsetX + 13, e.offsetY + 30);
                    vm.addState();
                }
                var elements = document.querySelectorAll('textarea');
                elements.forEach((element) => element.remove());
            }
        },

        getCanvas(){
            return this.fieldbookCanvas;
        }
    }
})
</script>

<style scoped>
#fieldbookCanvas {
    margin-top: 10px;
    position: absolute;
    top: 0px;
    left: 0px;
}

#backgroundCanvas {
    background-color: #fff;
    margin-top: 10px;
}

canvas {
    image-rendering: optimizeQuality;
}
</style>