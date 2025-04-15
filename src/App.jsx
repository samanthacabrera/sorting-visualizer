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
          <p>Select an algorithm and press Sort</p>
        )}
      </div>
    </div>
  );
}

export default App;