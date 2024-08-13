"use client";
import ConverToMinutesAndSecondsAndDigits from "@/lib/ConverToMinutesAndSecondsAndDigits";

const TrackList = ({ data, name }) => {


  console.log("getData :", data);
  console.log("getData name :", name);

  return (
    <div className="text-white p-6 rounded-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs uppercase text-gray-400 md:text-sm">
            <th className="w-10 p-2">#</th>
            <th className="p-2">Title</th>
            <th className="hidden md:table-cell p-2">Artist</th>
            <th className="w-20 p-2 text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((track, index) => (
            <tr
              key={index}
              className="group transition-all  ease-in-out"
              onClick={() => {console.log("tt", track)}}
            >
              <td className="p-2 group-hover:bg-gray-800 group-hover:cursor-pointer group-hover:rounded-l-lg transition-all  ease-in-out">
                {index + 1}
              </td>
              <td className="p-2 group-hover:bg-gray-800 group-hover:cursor-pointer transition-all  ease-in-out">
                {track?.name}
              </td>
              <td className="hidden md:table-cell p-2 group-hover:bg-gray-800 group-hover:cursor-pointer transition-all  ease-in-out">
                {name}
              </td>
              <td className="p-2 text-center group-hover:bg-gray-800 group-hover:rounded-r-lg group-hover:cursor-pointer transition-all  ease-in-out">
                {ConverToMinutesAndSecondsAndDigits(track?.duration_ms)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
