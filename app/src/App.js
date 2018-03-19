import React, { Component } from 'react';
import './App.css';

const floorPlanImg = require('./assets/floorPlan.png');

class App extends Component {
  state = {
    list: Array.from(new Array(10)),
  }
  componentDidMount() {
    this.circles = [];
    this.texts = [];
    const canvas = document.getElementById("myCanvas");
    this.context = canvas.getContext("2d");

    // const img = new Image();
    // img.src = floorPlanImg;
    // img.onload = () => {
    //   this.context.drawImage(img, 0, 0);
    // }

    canvas.onmousedown = this.canvasClick;
    canvas.onmouseup = this.stopDragging;
    canvas.onmouseout = this.stopDragging;
    canvas.onmousemove = this.dragCircle;

    this.canvas = canvas;
    this.isDragging = false;
    this.previousSelectedCircle = null;
  }
  dragCircle = (e) => {
    if (this.isDragging === true) {
      // 判断拖拽对象是否存在
      if (this.previousSelectedCircle !== null) {
        // 取得鼠标位置
        const circlePos = this.windowToCanvas(e.clientX, e.clientY);
        // 将圆圈移动到鼠标位置
        this.previousSelectedCircle.x = circlePos.x;
        this.previousSelectedCircle.y = circlePos.y;
        this.previousSelectedText.x = circlePos.x;
        this.previousSelectedText.y = circlePos.y + 75;
        // 更新画布
        this.drawCircles();
      }
    }
  }
  drawCircles = () => {
    const { canvas, context, circles, texts } = this;
    const len = circles.length;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < len; i++) {
      const circle = circles[i];
      const text = texts[i];

      context.globalAlpha = 0.85;
      context.beginPath();
      context.font = text.font;
      context.fillStyle = text.color;


      context.beginPath();
      context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      context.fillStyle = circle.color;
      context.strokeStyle = "black";

      if (circle.isSelected) {
        context.lineWidth = 5;
      }
      else {
        context.lineWidth = 1;
      }
      context.fill();
      context.stroke();
      context.fillText(text.id, text.x, text.y);
    }

  }
  addCircle = (e) => {
    const target = e.target;
    const id = target.dataset.value;
    const x = 50;
    const y = 50;
    const r = 50;
    const color = 'red';
    const font = 'bold 18px palatino';

    if (!this.equalPoint(id)) {
      const circle = this.createCircle(x, y, r, color, id);
      const text = this.createText(x, y + 75, font, color, id);
      this.circles.push(circle);
      this.texts.push(text);
      this.drawCircles()
    }

  }
  stopDragging = () => {
    this.isDragging = false;
  }
  canvasClick = (e) => {
    const circlePos = this.windowToCanvas(e.clientX, e.clientY);
    const len = this.circles.length;
    for (let i = 0; i < len; i++) {
      const circle = this.circles[i];
      const text = this.texts[i];

      const distanceFromCenter = Math.sqrt(Math.pow(circle.x - circlePos.x, 2) + Math.pow(circle.y - circlePos.y, 2));
      if (distanceFromCenter <= circle.radius) {
        // 清除之前选择的圆圈
        if (this.previousSelectedCircle != null) this.previousSelectedCircle.isSelected = false;
        this.previousSelectedCircle = circle;
        this.previousSelectedText = text;

        //选择新圆圈
        circle.isSelected = true;

        // 使圆圈允许拖拽
        this.isDragging = true;

        //更新显示
        this.drawCircles();

        //停止搜索
        return;
      }
    }
  }
  clearCanvas = () => {
    this.circles = [];
    this.drawCircles();
  }
  createCircle = (x, y, r, color, id) => {
    return {
      x,
      y,
      id,
      radius: r,
      color,
      isSelected: false,
    }
  }
  createText = (x, y, font, color, id) => {
    return {
      x: x,
      y: y,
      id: id,
      font: font,
      color: color,
    }
  }
  
  equalPoint = (id) => {
    for (const item of this.circles) {
      if (id === item.id) {
        return true
      }
    }
    return false;
  }
  windowToCanvas = (x, y) => {
    const pos = this.canvas.getBoundingClientRect();
    return {
      x: x - pos.left,
      y: y - pos.top,
    };
  }
  render() {
    const { list } = this.state;
    return (
      <div className="app">
        <div className="left">
          <canvas
            id="myCanvas"
            width="1322px"
            height="915px"
            style={{ background: `url(${floorPlanImg})`, backgroundSize: 'cover' }}
          >
            您的浏览器不支持canvas
          </canvas>
        </div>
        <div className="right">
          {list.map((item, index) => {
            /**
             * 点击块生成对应的圆
             */
            return (
              <div
                key={index}
                className="item"
                data-value={index}
                onClick={this.addCircle}
              />
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
