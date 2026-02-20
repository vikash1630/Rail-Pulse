import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
  <h2 className="text-2xl font-bold mb-6">Trains Data</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg">
      <thead className="bg-gray-200">
        <tr>
          {data.length > 0 &&
            Object.keys(data[0]).map((key) => (
              <th key={key} className="px-4 py-2 text-left text-sm font-semibold">
                {key}
              </th>
            ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="border-t">
            {Object.values(row).map((value, i) => (
              <td key={i} className="px-4 py-2 text-sm">
                {value ?? "N/A"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}

export default App;