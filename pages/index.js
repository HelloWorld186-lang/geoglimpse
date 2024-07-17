import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home({ countries }) {
  const [isClient, setIsClient] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country => 
      country.name.common.toLowerCase().includes(searchInput.toLowerCase()) &&
      (selectedRegion === "All" || country.region === selectedRegion)
    );
    setFilteredCountries(filtered);
  }, [searchInput, selectedRegion, countries]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const regions = ["All", ...new Set(countries.map(country => country.region))];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search country..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full sm:w-auto p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-gray-300 uppercase tracking-wider">Flag</th>
                <th className="px-4 py-3 text-gray-300 uppercase tracking-wider">Population</th>
                <th className="px-4 py-3 text-gray-300 uppercase tracking-wider">Area (km²)</th>
                <th className="px-4 py-3 text-gray-300 uppercase tracking-wider">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {filteredCountries.map((country) => (
                <tr key={country.name.official} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link href={`/${country.name.official.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-400">
                      {country.name.common}
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Image
                      src={country.flags.svg}
                      alt={`Flag of ${country.name.common}`}
                      width={32}
                      height={32}
                      className="rounded-sm"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {isClient ? formatNumber(country.population) : country.population}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {isClient ? formatNumber(country.area) : country.area}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{country.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    return {
      props: {
        countries: data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return {
      props: {
        countries: [],
      },
    };
  }
};