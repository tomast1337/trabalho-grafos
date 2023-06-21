import { useEffect, useRef, useState } from "react";
import { Graph } from "./entities/graph";
import { GraphDrawer } from "./entities/ultis/draw/graph-drawer";
import { AdjacencyMatrix } from "./entities/ultis/misc/adjacency-matrix";
import { ConnectedComponents } from "./entities/ultis/misc/connected-components";
import { GraphLoader } from "./entities/ultis/misc/graph-loader";
import { MeanDistance } from "./entities/ultis/misc/mean-distance";
import { KruskalAlgorithm } from "./entities/ultis/mst/kruskal-algorithm";
import { PrimAlgorithm } from "./entities/ultis/mst/prim-algorithm";
import { BFSPath } from "./entities/ultis/path_finding/BFS-path";
import { Dijkstra } from "./entities/ultis/path_finding/dijkstra-path";
import { BFSSearch } from "./entities/ultis/search/BFS-search";
import { DFSSearch } from "./entities/ultis/search/DFS-search";

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
  const [drawer, setDrawer] = useState<GraphDrawer | null>(null);

  // search
  const [endNode, setEndNode] = useState<string | null>(null);
  const [bfs, setBfs] = useState<string>("");
  const [dfs, setDfs] = useState<string>("");

  // adjacencymatrix
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<string>("");
  // adjacencylist
  const [adjacencyList, setAdjacencyList] = useState<string>("");
  // connected components
  const [connectedComponents, setConnectedComponents] = useState<string>("");
  // mean distance
  const [meanDistance, setMeanDistance] = useState<string>("");
  // mst
  const [mst, setMst] = useState<string>("");

  // shortest path
  const [sourceNode, setSourceNode] = useState<string | null>(null);
  const [targetNode, setTargetNode] = useState<string | null>(null);
  const [shortestPath, setShortestPath] = useState<string>("");

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
  const saveGraph = (filename: string) => {
    if (graph) {
      const data = graph.save();
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setMessage("Saved");
    } else {
      setMessage("No graph to save");
    }
  };
  const runAdjacencyMatrix = () => {
    if (graph) {
      const matrix = new AdjacencyMatrix<string>(graph);
      const str = matrix.printMatrix();
      setAdjacencyMatrix(str);
    } else {
      setMessage("No graph to get adjacency matrix");
    }
  };
  const runAdjacencyList = () => {
    if (graph) {
      const str = graph.printAdjacencyList();
      setAdjacencyList(str);
    } else {
      setMessage("No graph to get adjacency list");
    }
  };
  const runKruskal = () => {
    if (graph) {
      const prim = new KruskalAlgorithm<string>();
      const newGraph = prim.kruskalMST(graph);
      setGraph(newGraph);
      setMst("Árvore mínima gerada a partir de Kruskal:\n\n" + newGraph.save());
      saveGraph("mst_kruskal.txt");
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
      setMst("Árvore mínima gerada a partir de Prim:\n\n" + newGraph.save());
      saveGraph("mst_prim.txt");
      setMessage("");
    } else {
      setMessage("No graph to get MST (Prim)");
    }
  };
  const runMeanDistance = () => {
    if (graph) {
      setMeanDistance(new MeanDistance(graph).printAllDistances());
    } else {
      setMessage("No graph to get mean distance");
    }
  };
  const runConnectedComponents = () => {
    if (graph) {
      const connectedComponents = new ConnectedComponents(
        graph
      ).printConnectedComponents();
      setConnectedComponents(connectedComponents);
    } else {
      setMessage("No graph to get connected components");
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
      setBfs(bfs.print());
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
      setDfs(dfs.print());
      return tree;
    } else {
      setMessage("No graph to run DFS");
      throw new Error("No graph to run DFS");
    }
  };
  const runShortestPath = () => {
    if (!graph) {
      setMessage("No graph to get shortest path");
      return;
    }
    const source = sourceNode;
    const target = targetNode;
    if (source === target) {
      setMessage("Source and target nodes must be different");
    } else if (!source || !target) {
      setMessage("Source and target nodes are required");
    } else {
      if (graph.areWeightsEqual()) {
        console.log("Weights are equal, using BFS");
        const bfsPath = new BFSPath(graph, source, target);
        const [path, pathTree] = bfsPath.findShortestPath();
        console.log("Shortest path:", path.join(" -> "));
      } else {
        // Create an instance of Dijkstra
        const dijkstra = new Dijkstra(graph, source, target);
        // Find the shortest path between two nodes
        const [path, pathTree] = dijkstra.findShortestPath();
        console.log("Shortest path:", path.join(" -> "));
      }
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
      <article className="w-full px-20 grid grid-cols-1">
        <header>
          <section className="grid grid-cols-2 gap-4 w-full mb-5 my-5">
            <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5">
              <h1 className="text-5xl text-center font-bold text-black ">
                Trabalho grafo
              </h1>
              <h2 className="text-lg  font-bold text-black mt-5">Alunos:</h2>
              <p>Bernardo Martins Corrêa D'Abreu e Costa</p>
              <p>Nicolas Vycas Nery</p>
              <hr className="my-5 border-gray-500 w-full" />
              <p>
                View the source code on{" "}
                <a
                  className="text-blue-500"
                  href="https://github.com/tomast1337/trabalho-grafos"
                >
                  GitHub
                </a>
              </p>
            </div>

            <img
              src="/graph.svg"
              alt="logo"
              className="w-full h-[250px] object-cover rounded-lg"
            />
          </section>
        </header>

        {/* OPERATION MODE & INPUT DATA */}
        <section className="grid grid-cols-3 gap-4 w-full mb-5">
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5">
            <h2 className="text-3xl text-center font-bold">Operation mode</h2>
            <div className="w-full mx-auto flex flex-row justify-center items-center">
              {/* Check box slider */}

              <label className="flex items-center cursor-pointer flex-row">
                <label className="mx-2">String</label>
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
                  <div
                    className={`dot absolute ${
                      mododeOperacao === "string" ? "left-1" : "right-1"
                    } top-1 bg-white w-6 h-6 rounded-full transition ease-in-out`}
                  />
                </div>
                <label className="mx-2">Arquivo</label>
              </label>
            </div>
            {/* LOAD AND SAVE BUTTONS */}
            <div className="flex flex-row w-full gap-4 items-center justify-center rounded-lg p-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={carregar}
              >
                Load graph
              </button>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  isLoaded ? "" : "hidden"
                }`}
                onClick={() => saveGraph("graph.txt")}
              >
                Save graph
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 ">
            {mododeOperacao === "string" ? (
              <>
                <h2 className="text-2xl text-center font-bold">Data</h2>
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
        </section>

        {/* GRAPH */}
        <section className={`grid grid-cols-1 ${isLoaded ? "" : "hidden"}`}>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <canvas ref={canvasRef} className="" width="900px" height="500px" />
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
                    try {
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
                    } catch (error) {
                      setMessage(error.message);
                    }
                  }}
                >
                  BFS (Breadth-first search) and DFS (Depth-first search)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-5">
                <canvas ref={canvasBFSRef} width="400px" height="300px" />
                <canvas ref={canvasDFSRef} width="400px" height="300px" />
              </div>
            </div>
            <div className="flex flex-row w-full gap-8 items-center bg-white shadow-xl rounded-lg p-5 mb-5">
              <textarea
                className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
                value={bfs}
                readOnly
              ></textarea>
              <textarea
                className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
                value={dfs}
                readOnly
              ></textarea>
            </div>
          </div>
        </section>

        {/* ADJACENCY MATRIX & LIST */}
        <section
          className={`grid ${
            isLoaded ? "" : "hidden"
          } grid grid-cols-3 gap-4 w-full`}
        >
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <div className="flex flex-row w-full px-5 pb-2 justify-between items-center">
              <h1 className="text-2xl text-center font-bold">
                Adjacency matrix
              </h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runAdjacencyMatrix}
              >
                Run
              </button>
            </div>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={adjacencyMatrix}
              readOnly
            ></textarea>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <div className="flex flex-row w-full px-5 pb-2 justify-between items-center">
              <h1 className="text-2xl text-center font-bold">Adjacency list</h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runAdjacencyList}
              >
                Run
              </button>
            </div>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={adjacencyList}
              readOnly
            ></textarea>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <div className="flex flex-row w-full px-5 pb-2 justify-between items-center">
              <h1 className="text-2xl text-center font-bold">
                Connected components
              </h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runConnectedComponents}
              >
                Run
              </button>
            </div>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={connectedComponents}
              readOnly
            ></textarea>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <div className="flex flex-row w-full px-5 pb-2 justify-between items-center">
              <h1 className="text-2xl text-center font-bold">Mean distance</h1>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runMeanDistance}
              >
                Run
              </button>
            </div>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={meanDistance}
              readOnly
            ></textarea>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <div className="flex flex-row w-full px-5 pb-2 justify-between items-center">
              <h1 className="text-2xl text-center font-bold">MST</h1>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={runKruskal}
                >
                  Kruskal
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={runPrim}
                >
                  Prim
                </button>
              </div>
            </div>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={mst}
              readOnly
            ></textarea>
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <div className="flex flex-row justify-between gap-2">
              <h1 className="text-2xl text-center font-bold">Shortest path</h1>
              <input
                placeholder="Source node"
                type="text"
                className="flex-auto border-2 border-gray-500"
                value={sourceNode || ""}
                onChange={(e) => {
                  setSourceNode(e.target.value || null);
                }}
              />
              <input
                placeholder="Target node"
                type="text"
                className="border-2 border-gray-500"
                value={targetNode || ""}
                onChange={(e) => {
                  setTargetNode(e.target.value || null);
                }}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runShortestPath}
              >
                Run
              </button>
            </div>
            <textarea
              className="font-mono w-[90%] h-[300px] border-2 border-gray-500 p-2 focus:outline-none text-xl"
              value={shortestPath}
              readOnly
            ></textarea>
          </div>
        </section>

        {/* CONNECTED COMPONENTS & MEAN DISTANCE */}
        <section
          className={`grid ${
            isLoaded ? "" : "hidden"
          } grid grid-cols-2 gap-4 w-full`}
        ></section>

        {/* MST AND SHORTEST PATH */}
        <section
          className={`grid ${
            isLoaded ? "" : "hidden"
          } grid grid-cols-2 gap-4 w-full`}
        ></section>
      </article>
    </main>
  );
};

export default App;
