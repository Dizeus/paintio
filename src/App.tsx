import React, {MouseEvent, useLayoutEffect, useState} from 'react';
import rough from 'roughjs';
import './App.scss'
import {Drawable} from "roughjs/bin/core";

interface CanvasElement{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement: Drawable
}

function App() {


  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [tool, setTool] = useState<string>('line')
  useLayoutEffect(()=>{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D  = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const rCanvas = rough.canvas(canvas)

    elements.map(({roughElement})=>rCanvas.draw(roughElement))

  }, [elements])
  function createElement(x1: number, y1: number,x2: number, y2: number){

    const generator = rough.generator()
    let roughElement: Drawable;
    if(tool === 'line')
      roughElement = generator.line(x1,y1,x2,y2)
    else
      roughElement = generator.rectangle(x1,y1,x2-x1,y2-y1)
    return {x1,y1, x2, y2, roughElement}
  }
  function onMouseDownHandler(event: MouseEvent<HTMLCanvasElement>) {
    setIsDrawing(true)
    const {clientX, clientY}: {clientX: number, clientY: number} = event
    const element: CanvasElement = createElement(clientX, clientY, clientX, clientY)

    setElements(prevState => [...prevState, element])
  }
  function onMouseMoveHandler(event: MouseEvent<HTMLCanvasElement>) {
    if(!isDrawing) return;

    const {x1, y1}: {x1: number, y1: number} = elements[elements.length-1]
    const {clientX, clientY}: {clientX: number, clientY: number} = event
    const element: CanvasElement = createElement(x1, y1, clientX, clientY)
    setElements(prevState => [...prevState.slice(0, elements.length-1), element])

  }
  function onMouseUpHandler() {
    setIsDrawing(false)
  }

  return (
      <div className='app'>
        <div className="navbar">
          <button className='tool' onClick={()=>setTool('line')}>Line</button>
          <button className='tool' onClick={()=>setTool('rect')}>Rect</button>
        </div>
        <canvas id='canvas'
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={onMouseDownHandler}
                onMouseMove={onMouseMoveHandler}
                onMouseUp={onMouseUpHandler}
        >Canvas</canvas>
      </div>
  );
}

export default App;
