import { useState } from "react";

const GRID_SIZE = 8;
const MATCHES = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const MATRIX = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: 8 }, () => 0 as number | string),
);
console.log(MATRIX);

const NUM_BOMBS = 7;
const bombLocations: { [key: string]: boolean } = {};

for (let count = NUM_BOMBS; count > 0; count--) {
  let rowRandom: number, cellRandom: number;
  do {
    rowRandom = Math.floor(Math.random() * GRID_SIZE);
    cellRandom = Math.floor(Math.random() * GRID_SIZE);
  } while (bombLocations[`${cellRandom}-${rowRandom}`]);

  bombLocations[`${cellRandom}-${rowRandom}`] = true;
  MATRIX[cellRandom][rowRandom] = "B";
}

for (let rowIndex = 0; rowIndex < MATRIX.length; rowIndex++) {
  for (let cellIndex = 0; cellIndex < MATRIX[rowIndex].length; cellIndex++) {
    if (MATRIX[rowIndex][cellIndex] === "B") continue;

    let bombCount = 0;
    for (const match of MATCHES) {
      if (MATRIX[rowIndex + match[0]]?.[cellIndex + match[1]] === "B") {
        bombCount++;
      }
    }

    MATRIX[rowIndex][cellIndex] = bombCount;
  }
}

function Shovel() {
  return <img src="/shovel.svg" width="50" height="50" />;
}

function App() {
  const [clicked, setClicked] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  function handleClick(rowIndex: number, cellIndex: number) {
    setClicked((clicked) => clicked.concat(`${rowIndex}-${cellIndex}`));
    if (clicked.length + 1 === GRID_SIZE ** 2 - NUM_BOMBS) {
      setStatus("won");
    } else if (MATRIX[rowIndex][cellIndex] === "B") {
      setStatus("lost");
    }
  }

  return (
    <html data-theme="halloween">
      <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
        <header className="text-5xl py-4 font-bold leading-[3rem] text-center">
          Booscaminas
        </header>
        <section className=" flex items-center justify-start flex-col text-center text-4xl">
          <div className="py-8">
            {MATRIX.map((row, rowIndex) => (
              <article key={String(rowIndex)} className="flex">
                {row.map((cell: any, cellIndex: any) => (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={`h-20 w-20 border flex items-center justify-center ${clicked.includes(`${rowIndex}-${cellIndex}`) ? "bg-white/20" : "bg-transparent"}`}
                  >
                    {clicked.includes(`${rowIndex}-${cellIndex}`) ? (
                      <span>
                        {cell === "B" ? <Shovel /> : cell === 0 ? null : cell}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          status === "playing" &&
                          handleClick(rowIndex, cellIndex)
                        }
                        className="h-full w-full"
                      />
                    )}
                  </div>
                ))}
              </article>
            ))}
          </div>
          {status === "lost" && (
            <div>
              <p>You lost</p>
              <button
                className="btn btn-active btn-primary"
                onClick={() => window.location.reload()}
              >
                Play again
              </button>
            </div>
          )}

          {status === "won" && (
            <div>
              <p>You won!</p>
              <button
                className="btn btn-active btn-primary"
                onClick={() => window.location.reload()}
              >
                Play again
              </button>
            </div>
          )}
        </section>
      </main>
    </html>
  );
}

export default App;
