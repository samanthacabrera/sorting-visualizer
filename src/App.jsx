import { useState, useEffect } from "react";

function App() {
  const [array, setArray] = useState([]); 
  const [isSorting, setIsSorting] = useState(false); 
  const [currentIndices, setCurrentIndices] = useState([]); 
  const [sortedIndices, setSortedIndices] = useState([]); 
  const [algorithm, setAlgorithm] = useState("bubble"); 
  const [explanation, setExplanation] = useState(""); 
  const [animationSpeed, setAnimationSpeed] = useState(100);

  const colors = {
    compare: "#00BFFF", // blue
    sorted: "#8AE234",  // green
  };

  const generateArray = () => {
    const newArray = [];
    // gen 30 random nums between 1 and 100
    for (let i = 0; i < 30; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1);
    }
    setArray(newArray); // update array state
    setCurrentIndices([]); // reset compared indices
    setSortedIndices([]); // reset sorted indices
  };

  // gen array on mount
  useEffect(() => {
    generateArray();
  }, []);

  // pause for animation
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // get bar color based on state
  const getBarColor = (index) => {
    if (currentIndices.includes(index)) return colors.compare;
    if (sortedIndices.includes(index)) return colors.sorted;
    return "#CCCCCC"; // default for unsorted
  };

  // BUBBLE SORT 
  const bubbleSort = async () => {
    setIsSorting(true); // set sorting in progress
    setExplanation("Bubble Sort compares pairs of nums and swaps if needed, until largest 'bubbles' to end.");
    const arrayCopy = [...array]; // make copy of array
    
    // outer loop: iterate through array
    for (let i = 0; i < arrayCopy.length - 1; i++) {
      // inner loop: compare adj elements
      for (let j = 0; j < arrayCopy.length - 1 - i; j++) {
        setCurrentIndices([j, j + 1]); // highlight compared elements
        await sleep(animationSpeed); // pause for anim
        if (arrayCopy[j] > arrayCopy[j + 1]) {
          [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]]; // swap
          setArray([...arrayCopy]); // update state
        }
      }
      setSortedIndices(prev => [...prev, arrayCopy.length - 1 - i]); // mark sorted
    }
    setSortedIndices(prev => [...prev, 0]); // mark first as sorted
    setCurrentIndices([]); // reset indices
    setIsSorting(false); // done sorting
  };

  // MERGE SORT 
  const mergeSort = async () => {
    setIsSorting(true); // start sorting
    setExplanation("Merge Sort divides the list into smaller sublists until each contains one element, then 'merges' the sublists in sorted order."); // explain merge sort
    const arrayCopy = [...array]; // copy array for sorting
    const auxiliaryArray = [...arrayCopy]; // auxiliary array for merging
    await mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1, auxiliaryArray); // start merge sort
    setSortedIndices([...Array(arrayCopy.length).keys()]); // mark all as sorted
    setCurrentIndices([]); // reset current indices
    setIsSorting(false); // end sorting
  };

  // merge sort helper (recursion)
  const mergeSortHelper = async (mainArray, startIdx, endIdx, auxiliaryArray) => {
    if (startIdx === endIdx) return; // base case: one element
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    await mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray); // sort left half
    await mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray); // sort right half
    await doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray); // merge sorted halves
  };

  // merge two sorted halves
  const doMerge = async (mainArray, startIdx, middleIdx, endIdx, auxiliaryArray) => {
    let k = startIdx, i = startIdx, j = middleIdx + 1;
    const tempSortedIndices = []; // store sorted indices
    while (i <= middleIdx && j <= endIdx) {
      setCurrentIndices([i, j]); // highlight compared elements
      await sleep(animationSpeed); // pause for animation
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        mainArray[k] = auxiliaryArray[i]; // choose element from left half
        tempSortedIndices.push(k);
        i++;
      } else {
        mainArray[k] = auxiliaryArray[j]; // choose element from right half
        tempSortedIndices.push(k);
        j++;
      }
      k++;
      setArray([...mainArray]); // update array state
    }

    // copy remaining elements from left half
    while (i <= middleIdx) {
      setCurrentIndices([i]); // highlight element
      await sleep(animationSpeed); // pause for animation
      mainArray[k] = auxiliaryArray[i];
      tempSortedIndices.push(k);
      i++;
      k++;
      setArray([...mainArray]); // update array state
    }
    // copy remaining elements from right half
    while (j <= endIdx) {
      setCurrentIndices([j]); // highlight element
      await sleep(animationSpeed); // pause for animation
      mainArray[k] = auxiliaryArray[j];
      tempSortedIndices.push(k);
      j++;
      k++;
      setArray([...mainArray]); // update array state
    }
    setSortedIndices(prev => [...new Set([...prev, ...tempSortedIndices])]); // update sorted indices
    setCurrentIndices([]); // reset current indices
  };

  // INSERTION SORT 
  const insertionSort = async () => {
    setIsSorting(true); // start sorting
    setExplanation("Insertion Sort goes through the list one number at a time, inserting each one into its correct spot among the already sorted numbers."); // explain insertion sort
    const arrayCopy = [...array]; // make copy of array

    const tempSorted = []; // store sorted indices

    // loop through array starting from second element
    for (let i = 1; i < arrayCopy.length; i++) {
      let key = arrayCopy[i]; // current element to insert
      let j = i - 1; // index to compare against

      setCurrentIndices([i]); // highlight current key
      await sleep(animationSpeed); // pause for animation

      // move elements greater than key one position to the right
      while (j >= 0 && arrayCopy[j] > key) {
        setCurrentIndices([j, j + 1]); // highlight elements being compared
        arrayCopy[j + 1] = arrayCopy[j]; // shift element right
        j--;
        setArray([...arrayCopy]); // update array state
        await sleep(animationSpeed); // pause for animation
      }

      arrayCopy[j + 1] = key; // insert key into correct position
      setArray([...arrayCopy]); // update array state
      await sleep(animationSpeed); // pause for animation

      tempSorted.push(i); // mark current index as sorted
      setSortedIndices([...tempSorted]); // update sorted indices
    }

    // after loop, mark all elements as sorted
    setSortedIndices([...Array(arrayCopy.length).keys()]); 

    setCurrentIndices([]); // reset compared indices
    setIsSorting(false); // done sorting
  };

  // SELECTION SORT 
  const selectionSort = async () => {
    setIsSorting(true); // start sorting
    setExplanation("Selection Sort repeatedly finds the smallest unsorted element and swaps it into its correct position in the sorted part of the list."); // explain selection sort
    const arrayCopy = [...array]; // copy the array to sort
    const sorted = []; // store sorted indices
    for (let i = 0; i < arrayCopy.length; i++) {
      let minIndex = i; // assume current element is the smallest
      for (let j = i + 1; j < arrayCopy.length; j++) {
        setCurrentIndices([minIndex, j]); // highlight current pair
        await sleep(animationSpeed); // pause for animation
        if (arrayCopy[j] < arrayCopy[minIndex]) minIndex = j; // find smaller element
      }
      if (minIndex !== i) {
        [arrayCopy[i], arrayCopy[minIndex]] = [arrayCopy[minIndex], arrayCopy[i]]; // swap elements
        setArray([...arrayCopy]); // update array
        await sleep(animationSpeed); // pause for animation
      }
      sorted.push(i); // mark current index as sorted
      setSortedIndices([...sorted]); // update sorted indices
    }
    setCurrentIndices([]); // reset current indices
    setIsSorting(false); // end sorting
  };

  // QUICK SORT 
  const quickSort = async () => {
    setIsSorting(true); // start sorting
    setExplanation("Quick Sort picks a pivot, separates smaller and bigger numbers around it, then sorts each part."); // explain quicksort
    const arrayCopy = [...array]; // copy the array to sort
    await quickSortHelper(arrayCopy, 0, arrayCopy.length - 1); // run quicksort helper
    setSortedIndices([...Array(arrayCopy.length).keys()]); // mark all as sorted
    setCurrentIndices([]); // reset current indices
    setIsSorting(false); // end sorting
  };

  // quick sort recursion helper
  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high); // partition the array
      setSortedIndices(prev => [...prev, pivotIndex]); // mark pivot as sorted
      await quickSortHelper(arr, low, pivotIndex - 1); // sort left
      await quickSortHelper(arr, pivotIndex + 1, high); // sort right
    }
  };

  // partition for quick sort
  const partition = async (arr, low, high) => {
    let pivot = arr[high], i = low - 1; // set pivot and initial index
    for (let j = low; j < high; j++) {
      setCurrentIndices([j, high]); // highlight current pair
      await sleep(animationSpeed); // pause for animation
      if (arr[j] < pivot) {
        i++; // move i right if element is smaller than pivot
        [arr[i], arr[j]] = [arr[j], arr[i]]; // swap elements
        setArray([...arr]); // update array
        await sleep(animationSpeed); // pause for animation
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // move pivot to correct position
    setArray([...arr]); // update array
    await sleep(animationSpeed); // pause for animation
    return i + 1; // return pivot index
  };

  const startSort = () => {
    if (isSorting) return;
    setCurrentIndices([]);
    setSortedIndices([]);
    switch(algorithm) {
      case "bubble": bubbleSort(); break;
      case "insertion": insertionSort(); break;
      case "selection": selectionSort(); break;
      case "quick": quickSort(); break;
      case "merge": mergeSort(); break;
      default: bubbleSort(); // default to bubble
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
            onClick={() => setAlgorithm("quick")}
            disabled={isSorting}
            className={`px-4 py-2 border-2 rounded ${
              algorithm === "quick" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"
            } transition-all duration-200`}
          >
            Quick Sort
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

      <div className="absolute top-1/2 left-12 flex flex-col items-center">
        <div className="relative w-2 h-64 my-4">
          <input
            type="range"
            min="50"
            max="500"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="absolute inset-0 w-full h-full bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              writingMode: "vertical-rl", // makes slider vertical 
              transform: "rotate(180deg)",
              transformOrigin: "center", 
            }}
            disabled={isSorting}
          />
        </div>

        <div className="text-sm opacity-50 w-[100px]">
          Speed: {animationSpeed} ms
        </div>
      </div>

    </div>
  );
}

export default App;