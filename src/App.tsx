import { useEffect, useRef, useState } from "react";
import { GraphLoader } from "./entities/graph-loader";
import { GraphDrawer } from "./entities/graph-drawer";

const App = () => {
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
  const [message, setMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCurrent, setCanvasCurrent] = useState<HTMLCanvasElement | null>(
    null
  );

  const [seed, setSeed] = useState<string>("seed");

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
    try {
      graph = loader.loadFromText(data);
      setMessage("");
    } catch (e: any) {
      setMessage(e.message || "Erro desconhecido");
    }
    if (canvasCurrent && graph) {
      const drawer = new GraphDrawer<string>(graph, canvasCurrent, "seed");
      drawer.start(0);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasCurrent(canvasRef.current);
    }
  }, [canvasRef]);

  return (
    <main>
      <h1 className="text-5xl text-center font-bold">Trabalho grafo</h1>
      <article className="mx-auto w-full max-w-4xl grid grid-cols-1">
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
        </section>
        <section className="grid grid-cols-1">
          <div
            className={`flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5 ${
              message === "" ? "hidden" : ""
            }`}
          >
            <p className="text-3xl text-center font-bold text-red-300">
              {message}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={carregar}
            >
              Load
            </button>
          </div>
        </section>
        <section className={`grid grid-cols-1 ${isLoaded ? "" : "hidden"}`}>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <canvas ref={canvasRef} className="" width="500px" height="500px" />
          </div>
          <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-5 mb-5">
            <h1>Controls</h1>

            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="text"
                  className="border-2 border-gray-500"
                  onChange={(e) => {
                    setSeed(e.target.value);
                  }}
                  value={seed}
                  placeholder="Seed (for reproducibility)"
                />
              </div>
            </label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  placeholder="Search for a node"
                  type="text"
                  className="border-2 border-gray-500"
                />
              </div>
            </label>
            <div className="grid grid-cols-3 gap-4 w-full mb-5">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                get MTS (Kruskal)
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                get MTS (Prim)
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                get mean distance
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                BFS
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                DFS
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save graph
                </button>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default App;
