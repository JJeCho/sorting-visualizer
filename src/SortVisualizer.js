import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./SortVisualizer.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
/*
WIP: Add stop sort functionality
Visualize comparisons. Not just swaps
Fix CSS for responsiveness and better appearance
*/
const SortingVisualizer = () => {
  const [data, setData] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [animationSpeed, setAnimationSpeed] = useState(10); // Initial animation speed
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubbleSort"); // Initial algorithm selection
  const [isSorting, setIsSorting] = useState(false);
  const svgRef = useRef(null);
  const maxSvgWidth = 1800;
  const padding = 10;

  // Reset animation after sort with new generated array
  /*
  useEffect(() => {
    if (!isSorting) {
      setData(generateRandomArray(arraySize));
    }
  }, [arraySize, isSorting]);
  */

  function generateRandomArray(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
  }

  const generateNewArray = () => {
    setData(generateRandomArray(arraySize));
  };

  const handleArraySizeChange = (e) => {
    let newSize = parseInt(e.target.value, 10);
    newSize = Math.min(newSize, 150);
    setArraySize(newSize);
  };

  const handleAnimationSpeedChange = (e) => {
    setAnimationSpeed(e.target.value);
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
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 / animationSpeed)
          );
          setData([...array]);
        }
      }
      n--;
    } while (swapped);
  }

  async function insertionSort() {
    let array = [...data];
    const n = array.length;
    for (let i = 1; i < n; i++) {
      let current = array[i];
      let j = i - 1;
      while (j >= 0 && array[j] > current) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 / animationSpeed)
      );
      setData([...array]);
    }
  }

  async function selectionSort() {
    let array = [...data];
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 / animationSpeed)
        );
        setData([...array]);
      }
    }
  }

  async function quickSort(array, start = 0, end = array.length - 1) {
    if (start >= end) {
      return;
    }
    let index = await partition(array, start, end);
    await Promise.all([
      quickSort(array, start, index - 1),
      quickSort(array, index + 1, end),
    ]);
  }

  async function partition(array, start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    for (let i = start; i < end; i++) {
      if (array[i] < pivotValue) {
        [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 / animationSpeed)
        );
        setData([...array]);
        pivotIndex++;
      }
    }

    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    await new Promise((resolve) => setTimeout(resolve, 1000 / animationSpeed));
    setData([...array]);
    return pivotIndex;
  }

  async function mergeSort(array, start, end) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      await mergeSort(array, start, mid);
      await mergeSort(array, mid + 1, end);
      await merge(array, start, mid, end);
    }
  }

  async function merge(array, start, mid, end) {
    let leftArray = array.slice(start, mid + 1);
    let rightArray = array.slice(mid + 1, end + 1);
    let i = 0,
      j = 0,
      k = start;

    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i] <= rightArray[j]) {
        array[k++] = leftArray[i++];
      } else {
        array[k++] = rightArray[j++];
      }
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 / animationSpeed)
      );
      setData([...array]);
    }

    while (i < leftArray.length) {
      array[k++] = leftArray[i++];
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 / animationSpeed)
      );
      setData([...array]);
    }

    while (j < rightArray.length) {
      array[k++] = rightArray[j++];
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 / animationSpeed)
      );
      setData([...array]);
    }
  }

  async function startQuickSort() {
    let array = [...data];
    await quickSort(array);
  }
  async function startMergeSort() {
    let array = [...data];
    await mergeSort(array, 0, array.length - 1);
  }

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value);
  };

  const handleStopSorting = () => {
    setIsSorting(false);
  };

  const startSorting = async () => {
    setIsSorting(true);

    switch (selectedAlgorithm) {
      case "bubbleSort":
        await bubbleSort();
        break;
      case "insertionSort":
        await insertionSort();
        break;
      case "selectionSort":
        await selectionSort();
        break;
      case "quickSort":
        await startQuickSort();
        break;
      case "mergeSort":
        await startMergeSort();
        break;
      default:
        break;
    }

    setIsSorting(false);
  };

  useEffect(() => {
    setData(generateRandomArray(arraySize));
  }, [arraySize]);

  useEffect(() => {
    const svgWidth = arraySize > 50 ? maxSvgWidth : arraySize * 25;
    const svgHeight = 200;
  
    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("preserveAspectRatio", "xMidYMid meet");
  
    svg.selectAll("*").remove();
  
    const rectWidth =
      arraySize > 50 ? (maxSvgWidth - (arraySize - 1) * padding) / arraySize : 20;
  
    svg
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * (rectWidth + padding)}, 0)`)
      .append("rect")
      .attr("y", (d) => svgHeight - d)
      .attr("width", rectWidth)
      .attr("height", (d) => d)
      .attr("fill", "steelblue");
  
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * (rectWidth + padding) + rectWidth / 2)
      .attr("y", (d) => svgHeight - d - 5)
      .attr("text-anchor", "middle")
      .text((d) => d)
      .attr("font-size", "12px")
      .attr("fill", "black");
  }, [data, arraySize, maxSvgWidth, padding]);
  
  
  return (
    <div id="sorting-visualizer-container">
      <Form>
      <div id="sorting-visualizer-options">
        <div id="sorting-visualizer-array">
          <Form.Group controlId="arraySize">
          <Form.Label>Array Size:</Form.Label>

          <Form.Control
            type="number"
            id="arraySize"
            value={arraySize}
            onChange={handleArraySizeChange}
            min="1"
          />
          </Form.Group>
          <Button variant="primary" onClick={generateNewArray}>Generate New Array</Button>{' '}
        </div>
        <div id="sorting-visualizer-speed">
          <Form.Group controlId="speedSlider">
          <Form.Label>Animation Speed:</Form.Label>
          <Form.Range
            value={animationSpeed}
            min="1"
            max="100"
            step="1"
            onChange={handleAnimationSpeedChange}
          />
      </Form.Group>
        </div>
        <div id="sorting-visualizer-algorithm">
        <Form.Group controlId="algorithmSelect">
          <Form.Label>Select Sorting Algorithm:</Form.Label>
          <Form.Select
            id="algorithmSelect"
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
          >
            <option value="bubbleSort">Bubble Sort</option>
            <option value="insertionSort">Insertion Sort</option>
            <option value="selectionSort">Selection Sort</option>
            <option value="quickSort">Quick Sort</option>
            <option value="mergeSort">Merge Sort</option>
          </Form.Select>
          </Form.Group>
        </div>
        <Button variant="primary" onClick={startSorting}>Start Sorting</Button>{' '}
      </div>
      </Form>
      <div id="sorting-visualizer-svg">
        <svg id="sorting-svg" ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default SortingVisualizer;
