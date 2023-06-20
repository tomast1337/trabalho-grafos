import { useEffect, useRef, useState } from "react";
import { GraphLoader } from "./entities/graph-loader";
import { GraphDrawer } from "./entities/graph-drawer";
import { Graph } from "./entities/graph";
import { PrimAlgorithm } from "./entities/prim-algorithm";
import { KruskalAlgorithm } from "./entities/kruskal-algorithm";
import { AdjacencyMatrix } from "./entities/adjacency-matrix";
import { BFSSearch } from "./entities/BFS-search";
import { DFSSearch } from "./entities/DFS-search";

const App = () => {
  const [message, setMessage] = useState("");
  const [mododeOperacao, setModoDeOperacao] = useState<"arquivo" | "string">(
    "string"
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>(`5
1 2
2 5
5 3
4 5
1 5`);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBFSRef = useRef<HTMLCanvasElement>(null);
  const canvasDFSRef = useRef<HTMLCanvasElement>(null);
  const [canvasCurrent, setCanvasCurrent] = useState<HTMLCanvasElement | null>(
    null
  );

  const [seed, setSeed] = useState<string>("seed");
  const [graph, setGraph] = useState<Graph<string> | null>(null);
  const [drawer, setDrawer] = useState<GraphDrawer<string> | null>(null);

  // search
  const [endNode, setEndNode] = useState<string | null>(null);

  // adjacencymatrix
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<string>("");
  // adjacencylist
  const [adjacencyList, setAdjacencyList] = useState<string>("");

  const carregar = async () => {
    if (mododeOperacao === "string") {
      if (fileData) {
        loadGraph(fileData);
      }
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setFileData(e.target.result.toString());
            loadGraph(e.target.result.toString());
          }
        };
        reader.readAsText(file);
      }
    }
  };
  const loadGraph = (data: string) => {
    const loader = new GraphLoader();
    let graph;
    if (drawer) {
      drawer.stop();
    }

    try {
      graph = loader.loadFromText(data);
      setMessage("");
      setGraph(graph);
      runAdjacencyMatrix(graph);
      runAdjacencyList(graph);
    } catch (e: any) {
      setMessage(e.message || "Erro desconhecido");
    }
    if (graph && canvasCurrent) {
      const d = new GraphDrawer(graph, canvasCurrent, seed);
      d.start();
      setDrawer(d);
    }
    setIsLoaded(true);
  };
  const saveGraph = () => {
    if (graph) {
      const data = graph.save();
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "graph.txt";
      a.click();
      setMessage("Saved");
    } else {
      setMessage("No graph to save");
    }
  };
  const runAdjacencyMatrix = (graph: Graph<string>) => {
    const matrix = new AdjacencyMatrix<string>(graph);
    const str = matrix.printMatrix();
    setAdjacencyMatrix(str);
  };
  const runAdjacencyList = (graph: Graph<string>) => {
    const str = graph.printAdjacencyList();
    setAdjacencyList(str);
  };
  const runKruskal = () => {
    if (graph) {
      const prim = new KruskalAlgorithm<string>();
      const newGraph = prim.kruskalMST(graph);
      setGraph(newGraph);
      setMessage("");
    } else {
      setMessage("No graph to get MST (Kruskal)");
    }
  };
  const runPrim = () => {
    if (graph) {
      const prim = new PrimAlgorithm<string>();
      const newGraph = prim.primMST(graph);
      setGraph(newGraph);
      setMessage("");
    } else {
      setMessage("No graph to get MST (Prim)");
    }
  };
  const runMeanDistance = () => {
    if (graph) {
      setMessage(`Mean distance: ${graph.getMeanDistance()}`);
    } else {
      setMessage("No graph to get mean distance");
    }
  };
  const runBFS = (): Graph<string> => {
    if (graph) {
      const end = endNode;
      if (!end) {
        setMessage("Search node is required");
        throw new Error("Search node is required");
      }

      const bfs = new BFSSearch(graph, end);
      const [path, tree] = bfs.search();
      return tree;
    } else {
      setMessage("No graph to run BFS");
    }
  };
  const runDFS = (): Graph<string> => {
    if (graph) {
      const end = endNode;
      if (!end) {
        setMessage("Search node is required");
        throw new Error("Search node is required");
      }

      const dfs = new DFSSearch(graph, end);
      const [path, tree] = dfs.search();
      return tree;
    } else {
      setMessage("No graph to run DFS");
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasCurrent(canvasRef.current);
    }
  }, [canvasRef]);

  useEffect(
    () => {
      if (canvasCurrent && graph) {
        const drawer = new GraphDrawer(graph, canvasCurrent, seed);
        drawer.start();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [graph, canvasCurrent]
  );
  return (
    <main>
      <article className="mx-auto w-full max-w-4xl grid grid-cols-1">
        <header>
          <section className="grid grid-cols-2 gap-4 w-full mb-5 my-5">
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5">
              <h1 className="text-5xl text-center font-bold text-black ">
                Trabalho grafo
              </h1>
              <h2 className="text-lg  font-bold text-black mt-5">Alunos:</h2>
              <p>
                Bernardo Martins Corrêa D'Abreu e Costa e Nicolas Vycas Nery
              </p>
            </div>

            <img
              src="/graph.svg"
              alt="logo"
              className="w-full h-[250px] object-cover rounded-lg"
            />
          </section>
        </header>

        <section className="grid grid-cols-2 gap-4 w-full mb-5">
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5">
            <h2 className="text-3xl text-center font-bold">Operation mode</h2>
            <div className="w-full flex justify-center items-center ">
              {/* Check box slider */}
              <label className="flex items-center cursor-pointer">
                {/* toggle */}
                <div className="relative">
                  {/* input */}
                  <input
                    type="checkbox"
                    id="toggle"
                    className="sr-only"
                    onChange={(e) => {
                      setModoDeOperacao(
                        e.target.checked ? "string" : "arquivo"
                      );
                    }}
                  />
                  {/* line */}
                  <div className="block bg-gray-900 w-14 h-8 rounded-full"></div>
                  {/* dot */}
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                </div>
                {/* label */}
                <div className="ml-3 text-gray-700 font-medium">
                  {mododeOperacao === "string" ? "String" : "Arquivo"}
                </div>
              </label>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 ">
            {mododeOperacao === "string" ? (
              <>
                <h2 className="text-3xl text-center font-bold">Data</h2>
                <textarea
                  className="w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
                  onChange={(e) => {
                    setFileData(e.target.value);
                  }}
                  value={fileData}
                ></textarea>
              </>
            ) : (
              <>
                <h2 className="text-3xl text-center font-bold">Arquivo</h2>
                <div className="w-full h-[100px] flex justify-center items-center">
                  <input
                    type="file"
                    className="w-ful"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div
            className={`flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5 ${
              message === "" ? "hidden" : ""
            }`}
          >
            <p className="text-3xl text-center font-bold text-red-300">
              {message}
            </p>
          </div>

          <div
            className={`grid gap-4 ${
              isLoaded ? "grid-cols-2" : "grid-cols-1"
            } bg-white shadow-xl rounded-lg p-5 mb-5`}
          >
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={carregar}
            >
              Load
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isLoaded ? "" : "hidden"
              }`}
              onClick={saveGraph}
            >
              Save graph
            </button>
          </div>
        </section>
        <section
          className={`grid ${
            isLoaded ? "" : "hidden"
          } grid grid-cols-2 gap-4 w-full`}
        >
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <h1 className="text-2xl text-center font-bold">Adjacency matrix</h1>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={adjacencyMatrix}
              readOnly
            ></textarea>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <h1 className="text-2xl text-center font-bold">Adjacency list</h1>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={adjacencyList}
              readOnly
            ></textarea>
          </div>
        </section>
        <section className={`grid grid-cols-1 ${isLoaded ? "" : "hidden"}`}>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <canvas ref={canvasRef} className="" width="900px" height="900px" />
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <h1 className="text-2xl text-center font-bold">Options</h1>
            <div className="grid grid-cols-3 gap-4 w-full mb-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runKruskal}
              >
                Get MST (Kruskal-algorithm)
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runPrim}
              >
                Get MST (Prim-algorithm)
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runMeanDistance}
              >
                Get mean distance
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <h1 className="text-2xl text-center font-bold">Search</h1>
            <div className="flex flex-col items-center p-5 mb-5">
              <div className="grid grid-cols-1 gap-4 mb-5">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      placeholder="End node"
                      type="text"
                      className="border-2 border-gray-500"
                      value={endNode || ""}
                      onChange={(e) => {
                        setEndNode(e.target.value || null);
                      }}
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    const BFSgraph = runBFS();
                    const DFSgraph = runDFS();
                    if (canvasBFSRef.current && canvasDFSRef.current) {
                      const d1 = new GraphDrawer(
                        BFSgraph,
                        canvasBFSRef.current,
                        seed,
                        true
                      );
                      const d2 = new GraphDrawer(
                        DFSgraph,
                        canvasDFSRef.current,
                        seed,
                        true
                      );
                      d1.start();
                      d2.start();
                    }
                  }}
                >
                  BFS (Breadth-first search) and DFS (Depth-first search)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-5">
                <canvas ref={canvasBFSRef} width="400px" height="400px" />
                <canvas ref={canvasDFSRef} width="400px" height="400px" />
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default App;
