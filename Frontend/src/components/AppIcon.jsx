import { useNavigate } from "react-router-dom";
import logoUrl from "../assets/icon.svg";

/**
 * App home control: logo + product name — navigates via button + navigate().
 * Brand mark: `src/assets/icon.svg` (swap file to update the navbar logo).
 * @param {string} [to="/VehicleCatalogPage"]
 * @param {string} [title="DriveEase ERP"]
 * @param {string} [className] — extra classes on the button
 * @param {string} [imgClassName] — extra classes on the logo `<img>`
 */
export default function AppIcon({
  to = "/VehicleCatalogPage",
  title = "DriveEase ERP",
  className = "",
  imgClassName = "",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2${className ? ` ${className}` : ""}`}
    >
      <div
        className="flex h-10 w-10  shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-200"
        aria-hidden
      >
        <img
          src={logoUrl}
          alt=""
          className={`h-full w-full  object-contain p-1${imgClassName ? ` ${imgClassName}` : ""}`}
          width={36}
          height={36}
          decoding="async"
        />
      </div>
      <span className="text-lg font-semibold text-slate-800">{title}</span>
    </button>
  );
}
