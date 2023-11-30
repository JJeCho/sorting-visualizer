import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SortingVisualizer = () => {
  const [data, setData] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const svgRef = useRef(null);
  const maxSvgWidth = 50 * 25;
  const padding = 2;

  function generateRandomArray(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
  }

  const generateNewArray = () => {
    setData(generateRandomArray(arraySize));
  };

  const handleArraySizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setArraySize(newSize);
  };

  async function bubbleSort() {
    let array = [...data];
    let n = array.length;
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if (array[i] > array[i + 1]) {
          [array[i], array[i + 1]] = [array[i + 1], array[i]];
          swapped = true;
          await new Promise((resolve) => setTimeout(resolve, 100));
          setData([...array]);
        }
      }
      n--;
    } while (swapped);
  }

  const startSorting = () => {
    bubbleSort();
  };

  useEffect(() => {
    setData(generateRandomArray(arraySize));
  }, [arraySize]);

  useEffect(() => {
    const svgWidth = arraySize > 50 ? maxSvgWidth : arraySize * 25;

    const svg = d3.select(svgRef.current).attr('height', 150).attr('width', svgWidth);

    svg.selectAll('*').remove();

    const rectWidth = arraySize > 50 ? maxSvgWidth / arraySize : 20;

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (rectWidth+padding))
      .attr('y', (d) => 150 - d)
      .attr('width', rectWidth)
      .attr('height', (d) => d)
      .attr('fill', 'steelblue');
  }, [data, arraySize, maxSvgWidth, padding]);


  return (
    <div>
      <div>
        <label htmlFor="arraySize">Array Size:</label>
        <input
          type="number"
          id="arraySize"
          value={arraySize}
          onChange={handleArraySizeChange}
          min="1"
        />
        <button onClick={generateNewArray}>Generate New Array</button>
      </div>
      <svg ref={svgRef}></svg>
      <button onClick={startSorting}>Start Sorting</button>
    </div>
  );
};

export default SortingVisualizer;