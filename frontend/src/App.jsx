import { useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const getTrain = (e) => {
    e.preventDefault();

    if (!number) return;

    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/train?No=${number}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <form onSubmit={getTrain} className="space-x-3">
        <label>Enter Train No:</label>

        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border p-2"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>

      {loading && <h1 className="mt-5">Loading...</h1>}

      {data && (
        <div className="mt-5">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <h1 className="font-bold">{key} :</h1>
              <h2>{value}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;