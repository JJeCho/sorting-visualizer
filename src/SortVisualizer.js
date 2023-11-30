import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const SortVisualizer = () => {
  const [data, setData] = useState(generateRandomArray(20));

  function generateRandomArray(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
  }

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

  const generateNewArray = () => {
    setData(generateRandomArray(20));
  };

  useEffect(() => {
    const svg = d3.select('#sorting-container').append('svg').attr('height', 150);

    svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * 25)
    .attr('y', (d) => 150 - d)
    .attr('width', 20)
    .attr('height', (d) => d)
    .attr('fill', 'steelblue');

    return () => {
      d3.select('#sorting-container').selectAll('svg').remove();
    };
  }, [data]);

  return (
    <div>
      <div id="sorting-container"></div>
      <button onClick={startSorting}>Start Sorting</button>
      <button onClick={generateNewArray}>Generate New Array</button>
    </div>
  );
};

export default SortVisualizer;