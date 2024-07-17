import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const Country = ({ country }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!country) {
    return <div className="text-center py-10">Country not found</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 sm:p-6 space-y-6">
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
          ← Back to All Countries
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{country.name.common}</h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-4">{country.name.official}</p>
            <div className={`text-lg ${country.independent ? "text-green-400" : "text-red-400"} mb-4`}>
              {country.independent ? "Independent" : "Not Independent"}
            </div>
            <div className="space-y-2 text-sm sm:text-base">
              <p><span className="font-semibold">Status:</span> <span className="capitalize">{country.status}</span></p>
              <p><span className="font-semibold">Capital:</span> {country.capital}</p>
              <p><span className="font-semibold">Region:</span> {country.region}</p>
              <p><span className="font-semibold">Subregion:</span> {country.subregion}</p>
              <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
              <p><span className="font-semibold">Area:</span> {country.area.toLocaleString()} km²</p>
              <p><span className="font-semibold">Landlocked:</span> {country.landlocked ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}</p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="mb-4">
              <p className="font-semibold mb-2">Flag:</p>
              <Image src={country.flags.png} alt={`Flag of ${country.name.common}`} width={200} height={134} className="rounded-md" />
            </div>
            {country.coatOfArms.png && (
              <div>
                <p className="font-semibold mb-2">Coat of Arms:</p>
                <Image src={country.coatOfArms.png} alt={`Coat of Arms of ${country.name.common}`} width={100} height={100} className="rounded-md" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">General Information</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p><span className="font-semibold">Currency:</span> {country.currencies[Object.keys(country.currencies)[0]].symbol} {country.currencies[Object.keys(country.currencies)[0]].name}</p>
              <p><span className="font-semibold">Languages:</span> {Object.values(country.languages).join(", ")}</p>
              <p><span className="font-semibold">Timezones:</span> {country.timezones.join(", ")}</p>
              <p><span className="font-semibold">Continent:</span> {country.continents.join(", ")}</p>
              <p><span className="font-semibold">Start of week:</span> {country.startOfWeek}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Geographic Information</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p><span className="font-semibold">Latitude and Longitude:</span> {country.latlng.join(", ")}</p>
              {country.capitalInfo.latlng && (
                <p><span className="font-semibold">Capital Location:</span> {country.capitalInfo.latlng.join(", ")}</p>
              )}
              <p><span className="font-semibold">Car sign:</span> {country.car.signs.join(", ")}</p>
              <p><span className="font-semibold">Car side:</span> {country.car.side}</p>
              {country.postalCode && (
                <>
                  <p><span className="font-semibold">Postal code format:</span> {country.postalCode.format}</p>
                  <p><span className="font-semibold">Postal code regex:</span> {country.postalCode.regex}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
            View on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    const paths = data.map((country) => ({
      params: { name: country.name.official.toLowerCase().replace(/\s+/g, '-') },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${params.name.replace(/-/g, ' ')}`);
    const data = await response.json();
    return {
      props: {
        country: data[0] || null,
      },
    };
  } catch (error) {
    console.error("Error fetching country:", error);
    return {
      props: {
        country: null,
      },
    };
  }
};

export default Country;