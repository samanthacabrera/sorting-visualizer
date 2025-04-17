import { useState, useEffect } from "react";

function App() {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [explanation, setExplanation] = useState("");

  const colors = {
    compare: "#00BFFF", // Blue 
    sorted: "#8AE234",  // Green 
  };

  const ANIMATION_SPEED_MS = 100;

  // Generate a new random array
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 30; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(newArray);
    setCurrentIndices([]);
    setSortedIndices([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const getBarColor = (index) => {
    if (currentIndices.includes(index)) {
      return colors.compare;
    }
    if (sortedIndices.includes(index)) {
      return colors.sorted;
    }
    return "#CCCCCC"; 
  };

  // Bubble Sort Algorithm
  const bubbleSort = async () => {
    setIsSorting(true);
    setExplanation("Bubble Sort works by comparing two numbers at a time. If a bigger number comes before a smaller one, it swaps them. This keeps happening until the biggest numbers 'bubble up' to the end and the whole list is sorted.");
    const arrayCopy = [...array];
    
    for (let i = 0; i < arrayCopy.length - 1; i++) {
      for (let j = 0; j < arrayCopy.length - 1 - i; j++) {
        setCurrentIndices([j, j + 1]);
        await sleep(ANIMATION_SPEED_MS);
        
        if (arrayCopy[j] > arrayCopy[j + 1]) {
          // Swap elements
          [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
          setArray([...arrayCopy]);
        }
      }
      // Mark this element as sorted
      setSortedIndices(prev => [...prev, arrayCopy.length - 1 - i]);
    }
    
    // Mark the first element as sorted too
    setSortedIndices(prev => [...prev, 0]);
    setCurrentIndices([]);
    setIsSorting(false);
  };

  // Merge Sort Algorithm
  const mergeSort = async () => {
    setIsSorting(true);
    setExplanation("Merge Sort works as a two-step process: first divide the list into smaller pieces, then merge those pieces back together in the correct order. It's called 'merge' because the main work happens when combining (merging) the smaller sorted lists into larger ones.");
    const arrayCopy = [...array];

    const auxiliaryArray = [...arrayCopy];
    
    await mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1, auxiliaryArray);

    setSortedIndices([...Array(arrayCopy.length).keys()]);
    setCurrentIndices([]);
    setIsSorting(false);
  };
  // Recursive function to divide the array and merge
  const mergeSortHelper = async (mainArray, startIdx, endIdx, auxiliaryArray) => {
    if (startIdx === endIdx) return;
     // Find the middle point to divide the array
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    await mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray);
    await mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray);
    // Merge the sorted halves
    await doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray);
  };

  const doMerge = async (mainArray, startIdx, middleIdx, endIdx, auxiliaryArray) => {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    const tempSortedIndices = [];

    while (i <= middleIdx && j <= endIdx) {
      setCurrentIndices([i, j]);
      await sleep(ANIMATION_SPEED_MS);

      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        mainArray[k] = auxiliaryArray[i];
        tempSortedIndices.push(k);
        i++;
      } else {
        mainArray[k] = auxiliaryArray[j];
        tempSortedIndices.push(k);
        j++;
      }
      k++;
      setArray([...mainArray]);
    }

    while (i <= middleIdx) {
      setCurrentIndices([i]);
      await sleep(ANIMATION_SPEED_MS);
      mainArray[k] = auxiliaryArray[i];
      tempSortedIndices.push(k);
      i++;
      k++;
      setArray([...mainArray]);
    }

    while (j <= endIdx) {
      setCurrentIndices([j]);
      await sleep(ANIMATION_SPEED_MS);
      mainArray[k] = auxiliaryArray[j];
      tempSortedIndices.push(k);
      j++;
      k++;
      setArray([...mainArray]);
    }

    // Gradually mark the merged elements as sorted
    setSortedIndices(prev => [...new Set([...prev, ...tempSortedIndices])]);
    setCurrentIndices([]);
  };

  // Insertion Sort Algorithm
  const insertionSort = async () => {
    setIsSorting(true);
    setExplanation("Insertion Sort works by inserting each number into its correct position. We take one number at a time and insert it exactly where it belongs among the numbers we've already sorted. It's like taking a new number and finding its proper place in an already organized section.");
    
    const arrayCopy = [...array];

    for (let i = 1; i < arrayCopy.length; i++) {
      let key = arrayCopy[i];
      let j = i - 1;

      // Highlight the key
      setCurrentIndices([i]);
      await sleep(ANIMATION_SPEED_MS);

      while (j >= 0 && arrayCopy[j] > key) {
        setCurrentIndices([j, j + 1]);
        arrayCopy[j + 1] = arrayCopy[j];
        j--;
        setArray([...arrayCopy]);
        await sleep(ANIMATION_SPEED_MS);
      }

      arrayCopy[j + 1] = key;
      setArray([...arrayCopy]);
      await sleep(ANIMATION_SPEED_MS);
    }

    setSortedIndices([...Array(arrayCopy.length).keys()]);
    setCurrentIndices([]);
    setIsSorting(false);
  };

  // Selection Sort Algorithm
  const selectionSort = async () => {
    setIsSorting(true);
    setExplanation("Selection Sort works by repeatedly 'selecting' the smallest remaining element. For each position in the list, it selects the smallest number from the unsorted portion and places it there. It builds the sorted list one selection at a time, always picking the smallest available number next.");
    
    const arrayCopy = [...array];
    const sorted = [];

    for (let i = 0; i < arrayCopy.length; i++) {
      let minIndex = i;

      for (let j = i + 1; j < arrayCopy.length; j++) {
        setCurrentIndices([minIndex, j]);
        await sleep(ANIMATION_SPEED_MS);
        if (arrayCopy[j] < arrayCopy[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        [arrayCopy[i], arrayCopy[minIndex]] = [arrayCopy[minIndex], arrayCopy[i]];
        setArray([...arrayCopy]);
        await sleep(ANIMATION_SPEED_MS);
      }

      // Mark i as sorted
      sorted.push(i);
      setSortedIndices([...sorted]);
    }

    setCurrentIndices([]);
    setIsSorting(false);
  };

  // Quick Sort Algorithm
  const quickSort = async () => {
    setIsSorting(true);
    setExplanation("Quick Sort works by selecting a 'pivot' number, then quickly arranging all smaller numbers before it and all larger numbers after it. This process repeats on the smaller sections until everything is sorted. It is typically faster than other simple sorting algorithms.");
    const arrayCopy = [...array];

    await quickSortHelper(arrayCopy, 0, arrayCopy.length - 1);

    // After sorting, mark all as sorted
    setSortedIndices([...Array(arrayCopy.length).keys()]);
    setCurrentIndices([]);
    setIsSorting(false);
  };

  // Helper for recursive Quick Sort
  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high);
      
      // ✅ Mark the pivot as sorted immediately
      setSortedIndices(prev => [...prev, pivotIndex]);
      
      await quickSortHelper(arr, low, pivotIndex - 1);
      await quickSortHelper(arr, pivotIndex + 1, high);
    }
  };

  // Partition the array around the pivot
  const partition = async (arr, low, high) => {
    let pivot = arr[high]; // Pivot element
    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
      setCurrentIndices([j, high]);
      await sleep(ANIMATION_SPEED_MS);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(ANIMATION_SPEED_MS);
      }
    }
    // Swap pivot to correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(ANIMATION_SPEED_MS);
    return i + 1;
  };

  // Start the selected sorting algorithm
  const startSort = () => {
    if (isSorting) return;
    
    setCurrentIndices([]);
    setSortedIndices([]);
    
    switch(algorithm) {
      case "bubble":
        bubbleSort();
        break;
      case "insertion":
        insertionSort();
        break;
      case "selection":
        selectionSort();
        break;
      case "quick":
        quickSort();
        break;
      case "merge":
        mergeSort();
        break;
      default:
        bubbleSort();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="text-6xl tracking-wide mb-12">Sorting Algorithms Visualizer</h1>
      <div className="flex gap-6 m-2">
        <button
          onClick={() => setAlgorithm("bubble")}
          disabled={isSorting}
          className={`px-4 py-2 border-2 rounded ${
            algorithm === "bubble" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"
          } transition-all duration-200`}
        >
          Bubble Sort
        </button>
        <button
            onClick={() => setAlgorithm("merge")}
            disabled={isSorting}
            className={`px-4 py-2 border-2 rounded ${
              algorithm === "merge" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"
            } transition-all duration-200`}
          >
            Merge Sort
        </button>
        <button
          onClick={() => setAlgorithm("insertion")}
          disabled={isSorting}
          className={`px-4 py-2 border-2 rounded ${
            algorithm === "insertion" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"
          } transition-all duration-200`}
        >
          Insertion Sort
        </button>
        <button
          onClick={() => setAlgorithm("selection")}
          disabled={isSorting}
          className={`px-4 py-2 border-2 rounded ${
            algorithm === "selection" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"
          } transition-all duration-200`}
        >
          Selection Sort
        </button>
        <button
          onClick={() => setAlgorithm("quick")}
          disabled={isSorting}
          className={`px-4 py-2 border-2 rounded ${
            algorithm === "quick" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"
          } transition-all duration-200`}
        >
          Quick Sort
        </button>
      </div>

      <div className="flex gap-6 m-2">
        <button
          onClick={generateArray}
          disabled={isSorting}
          className={`px-4 py-2 border-2 border-black rounded ${
            isSorting ? "cursor-not-allowed" : "bg-white hover:bg-black hover:text-white"
          } transition-all duration-200`}
        >
          New Array
        </button>
        <button
          onClick={startSort}
          disabled={isSorting}
          className={`px-4 py-2 border-2 border-black rounded ${
            isSorting ? "cursor-not-allowed" : "bg-white hover:bg-black hover:text-white"
          } transition-all duration-200`}
        >
          Sort Array
        </button>
      </div>
      
      <div className="flex items-end h-64 w-full justify-center">
        {array.map((value, index) => (
          <div
            key={index}
            className="mx-px w-4 transition-all duration-100"
            style={{ 
              height: `${value * 2}px`,
              backgroundColor: getBarColor(index)
            }}
          />
        ))}
      </div>
      
      <div className="mt-12 max-w-4xl">
        {isSorting ? (
          <p>{explanation}</p>
        ) : (
          <p>Select an algorithm and press 'Sort Array'.</p>
        )}
      </div>
    </div>
  );
}

export default App;