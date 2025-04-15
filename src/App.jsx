import { useState, useEffect } from "react";

function App() {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [explanation, setExplanation] = useState("");

  const colors = {
    bubble: "#390099", // Purple
    insertion: "#9E0059", // Dark Pink
    selection: "#FF0054", // Pink
    quick: "#FF5400", // Orange
    merge: "#FFBD00", // Yellow
    sorted: "#8AE234", // Green 
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
    if (sortedIndices.includes(index)) {
      return colors.sorted;
    }
    if (currentIndices.includes(index)) {
      return colors[algorithm];
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
    setExplanation("Merge Sort works by splitting the list in half again and again until each piece has just one number. Then, it 'merges' the pieces back together in the right order.");
    const arrayCopy = [...array];

    const auxiliaryArray = [...arrayCopy];
    
    await mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1, auxiliaryArray);

    setSortedIndices([...Array(arrayCopy.length).keys()]);
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
    let k = startIdx; // Pointer for where to place the next element in mainArray
    let i = startIdx; // Pointer for the left half
    let j = middleIdx + 1; // Pointer for the right half

    while (i <= middleIdx && j <= endIdx) {
       // Highlight compared bars
      setCurrentIndices([i, j]);
      await sleep(ANIMATION_SPEED_MS);
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        mainArray[k++] = auxiliaryArray[j++];
      }
      setArray([...mainArray]);
    }

    // Copy any remaining elements from the left half
    while (i <= middleIdx) {
      setCurrentIndices([i]);
      await sleep(ANIMATION_SPEED_MS);
      mainArray[k++] = auxiliaryArray[i++];
      setArray([...mainArray]);
    }

    // Copy any remaining elements from the right half
    while (j <= endIdx) {
      setCurrentIndices([j]);
      await sleep(ANIMATION_SPEED_MS);
      mainArray[k++] = auxiliaryArray[j++];
      setArray([...mainArray]);
    }
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
      <div className="flex gap-6 m-6">
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