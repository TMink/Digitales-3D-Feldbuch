<!--
 * Created Date: 06.03.2024 16:25:57
 * Author: Methusshan Elankumaran
 * 
 * Last Modified: 08.03.2024 15:22:34
 * Modified By: Methusshan Elankumaran
 * 
 * Description: canvas component for technical drawings
 -->

<template>
    <canvas id="backgroundCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    <canvas id="fieldbookCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>

<script>
import { defineComponent } from 'vue'

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
        fontFamily: {
            type: String,
            default: "Arial"
        },
        fontSize: {
            type: Number,
            default: 20
        },
        filled: {
            type: Boolean,
            default: false
        },
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
            textfieldCreated: false,
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            textFieldTop: 0,
            textFieldLeft: 0,
            snapshot: null,
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
            this.fieldbookContext.font = this.getFontStyle();
            if (this.mode === "text" && !this.textfieldCreated) {
                this.addInput(e);
                this.textfieldCreated = true;
            }
            else {
                this.isDrawing = true;
                [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
                this.fieldbookContext.beginPath();
                this.fieldbookContext.moveTo(this.lastX, this.lastY);
            }
            this.snapshot = this.fieldbookContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
            
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
            this.fieldbookContext.putImageData(this.snapshot, 0, 0);
            if (this.mode === "pen" || this.mode === "eraser") {
                var cpX = (currentX + this.lastX) / 2;
                var cpY = (currentY + this.lastY) / 2;
                this.fieldbookContext.globalCompositeOperation = this.mode === "eraser" ? 'destination-out' : 'source-over';
                this.fieldbookContext.quadraticCurveTo(this.lastX, this.lastY, cpX, cpY);
                this.fieldbookContext.stroke();
                this.lastX = currentX;
                this.lastY = currentY;
            }
            if (this.mode === "rectangle") {
                this.drawRect(e);
            }
            if(this.mode === "circle"){
                this.drawCircle(e);
            }
            if(this.mode === "triangle"){
                this.drawTriangle(e);
            }
            if(this.mode === "line"){
                this.drawLine(e);
            }
            if(this.mode === "dotted-line"){
                this.drawDottedLine(e);
            }
        },

        drawRect(e) {
            if(!this.filled){
                this.fieldbookContext.strokeRect(e.offsetX, e.offsetY, this.lastX - e.offsetX, this.lastY - e.offsetY);
            }
            else{
                this.fieldbookContext.fillRect(e.offsetX, e.offsetY, this.lastX - e.offsetX, this.lastY - e.offsetY);
            }
            
        },

        drawCircle(e){
            this.fieldbookContext.beginPath();
            let radius = Math.sqrt(Math.pow(this.lastX - e.offsetX, 2) + Math.pow(this.lastY - e.offsetY, 2))
            this.fieldbookContext.arc(this.lastX, this.lastY, radius, 0, 2 * Math.PI);
            this.filled ? this.fieldbookContext.fill() : this.fieldbookContext.stroke();
        },

        drawTriangle(e){
            this.fieldbookContext.setLineDash([])
            this.fieldbookContext.beginPath();
            this.fieldbookContext.moveTo(this.lastX, this.lastY);
            this.fieldbookContext.lineTo(e.offsetX, e.offsetY);
            this.fieldbookContext.lineTo(this.lastX * 2 - e.offsetX, e.offsetY);
            this.fieldbookContext.closePath();
            this.filled ? this.fieldbookContext.fill() : this.fieldbookContext.stroke();
        },

        drawLine(e){
            this.fieldbookContext.setLineDash([])
            this.fieldbookContext.beginPath();
            this.fieldbookContext.moveTo(this.lastX, this.lastY);
            this.fieldbookContext.lineTo(e.offsetX, e.offsetY);
            this.fieldbookContext.stroke();
        },

        drawDottedLine(e){
            this.fieldbookContext.setLineDash([10, 20])
            this.fieldbookContext.beginPath();
            this.fieldbookContext.moveTo(this.lastX, this.lastY);
            this.fieldbookContext.lineTo(e.offsetX, e.offsetY);
            this.fieldbookContext.stroke();
        },

        endDrawing() {
            if (this.isDrawing) {
                this.isDrawing = false;
                this.fieldbookContext.closePath();
                this.addState();
            }
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
            var btn = document.createElement('button');
            var vm = this;

            var textWidth = 350;
            var textHeight = 150;

            //Textarea creation
            textarea.style.position = 'fixed';
            textarea.style.left = e.clientX + 'px';
            textarea.style.top = e.clientY + 'px';
            textarea.style.color = vm.color;
            textarea.style.border = "4px solid #27303d";
            textarea.style.borderRadius = "15px";
            textarea.style.padding = "10px";
            textarea.style.font = vm.getFontStyle();
            textarea.style.resize = "both";
            textarea.style.width = textWidth + "px";
            textarea.style.height = textHeight + "px";

            textarea.addEventListener('focus', function () {
                this.style.border = "4px solid #27303d"
                this.style.borderRadius = "15px";
            });

            document.body.appendChild(textarea);

            //Button creation
            btn.style.position = 'fixed';
            btn.style.left = e.clientX + textarea.clientWidth + 10 + 'px';
            btn.style.top = e.clientY + textarea.clientHeight - 40 + 'px';
            btn.style.width = "50px";
            btn.style.height = "50px";
            btn.style.color = "black";
            btn.textContent = "Save"
            btn.style.borderRadius = "10px"
            btn.style.fontStyle = "bold"
            btn.style.backgroundColor = "#FB9678";

            document.body.appendChild(btn);

            btn.addEventListener('click', (event) => {
                drawText(textarea, btn, vm, e);
            })


            /**
       * Prints the value of the inputfield on the cancas and deletes the input-fields
       * 
       * @param {*} Input Inputfield containing the string to be printed
       * @param {*} vm this-Instance of the PlaceForm-Component 
       * */
            async function drawText(input, btn, vm, e) {
                if (input.value != "") {
                    var lineheight = vm.fontSize + 5;
                    var lines = input.value.split('\n');

                    for (var i = 0; i < lines.length; i++)
                        await vm.fieldbookContext.fillText(lines[i], e.offsetX + 13, e.offsetY + 30 + (i * lineheight));
                }
                input.remove();
                btn.remove();
                vm.textfieldCreated = false;
                vm.addState();
            }
        },

        addWhiteBackgroundToImage() {
            var newCanvas = document.createElement('canvas')
            var newContext = newCanvas.getContext('2d');
            newCanvas.width = this.canvasWidth;
            newCanvas.height = this.canvasHeight;
            newContext.drawImage(this.fieldbookCanvas, 0, 0);
            newContext.fillStyle = "#fff"
            newContext.globalCompositeOperation = "destination-over";
            newContext.rect(0, 0, this.canvasWidth, this.canvasHeight);
            newContext.fill();
            return newCanvas;
        },

        getFontStyle() {
            return this.fontSize + "px " + this.fontFamily;
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