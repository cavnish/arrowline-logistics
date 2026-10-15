"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { MapPin, Search, X, ChevronDown, Loader2 } from "lucide-react";

import type { City } from "@/lib/estimator/indianCities";
import { searchCities } from "@/lib/estimator/indianCities";
import type { MapPlace } from "@/lib/estimator/maps/types";
import { loadGoogleMaps } from "@/lib/estimator/maps/loadGoogleMaps";
import { cn } from "@/lib/cn";

/** Convert an offline hub-dataset city into a full `MapPlace` (real coords). */
export function cityToPlace(city: City): MapPlace {
  return {
    key: `city:${city.id}`,
    label: city.name,
    detail: city.state,
    state: city.state,
    lat: city.lat,
    lng: city.lng,
    source: "city" as const,
  };
}

function placeToMapPlace(place: google.maps.places.PlaceResult): MapPlace | null {
  const location = place.geometry?.location;
  if (!location) return null;
  const components = place.address_components ?? [];
  const stateComp = components.find((c) => c.types.includes("administrative_area_level_1"));
  const shortAddress = (place.formatted_address ?? "").split(",").slice(0, 2).join(",").trim();
  const label =
    place.name?.trim() ||
    (place.formatted_address ?? "").split(",")[0]?.trim() ||
    "Selected location";
  return {
    key: `places:${place.place_id || `${location.lat()}:${location.lng()}`}`,
    label,
    detail: stateComp?.long_name || shortAddress || label,
    state: stateComp?.long_name,
    lat: location.lat(),
    lng: location.lng(),
    address: place.formatted_address,
    source: "places" as const,
  };
}

interface LocationAutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  value: MapPlace | null;
  onChange: (place: MapPlace | null) => void;
  hasError?: boolean;
}

export default function LocationAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  hasError,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [placesMode, setPlacesMode] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placesLoadStarted = useRef(false);
  const committedRef = useRef<MapPlace | null>(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const listboxId = `${id}-listbox`;
  const optionId = (i: number) => `${id}-option-${i}`;

  // City-dataset suggestions only apply until Google Places takes over.
  const suggestions = useMemo(
    () => (isSuggestionsOpen && !placesMode ? searchCities(query, 8) : []),
    [query, isSuggestionsOpen, placesMode]
  );

  // Keep the visible text in sync when the parent changes the selection
  // externally (swap, quick lane, clear).
  useEffect(() => {
    setQuery(value?.label ?? "");
    committedRef.current = value;
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const matchesCommitted = (text: string): boolean => {
    const t = text.trim().toLowerCase();
    const committed = committedRef.current;
    if (!committed) return false;
    return (
      committed.label.toLowerCase() === t ||
      (committed.address != null && committed.address.toLowerCase() === t)
    );
  };

  /** Start the lazy Maps load on first user interaction with the field. */
  const ensurePlacesLoaded = () => {
    if (placesLoadStarted.current) return;
    placesLoadStarted.current = true;
    setPlacesLoading(true);
    loadGoogleMaps().then((maps) => {
      setPlacesLoading(false);
      // Places is ready only when the library made it to `google.maps`.
      if (maps && maps.places && maps.DirectionsService && inputRef.current) {
        setPlacesMode(true);
      }
      // Otherwise we silently keep the offline city-dataset fallback.
    });
  };

  // Attach the Google Places Autocomplete once loaded (Places performs its own
  // server-side debouncing; the city dataset is an in-memory local search).
  useEffect(() => {
    if (!placesMode || !inputRef.current) return;
    const input = inputRef.current;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "IN" },
      fields: ["place_id", "name", "formatted_address", "geometry", "address_components"],
    });
    autocompleteRef.current = autocomplete;

    const listener = autocomplete.addListener("place_changed", () => {
      const mapped = placeToMapPlace({ ...autocomplete.getPlace() });
      if (!mapped) return;
      committedRef.current = mapped;
      onChangeRef.current(mapped);
      setQuery(mapped.label);
      input.value = mapped.label;
      setIsSuggestionsOpen(false);
      setActiveIndex(-1);
    });

    return () => {
      listener.remove();
      autocomplete.unbindAll();
      autocompleteRef.current = null;
    };
  }, [placesMode]);

  const handleChange = (raw: string) => {
    setQuery(raw);
    if (!placesMode) {
      setIsSuggestionsOpen(true);
      setActiveIndex(-1);
    }
    if (matchesCommitted(raw)) return;
    if (committedRef.current) {
      committedRef.current = null;
      onChangeRef.current(null);
    }
  };

  const commitCity = (city: City) => {
    const place = cityToPlace(city);
    committedRef.current = place;
    setQuery(city.name);
    if (inputRef.current) inputRef.current.value = city.name;
    onChangeRef.current(place);
    setIsSuggestionsOpen(false);
    setActiveIndex(-1);
  };

  const clearSelection = () => {
    committedRef.current = null;
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
    onChangeRef.current(null);
    setIsSuggestionsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (placesMode) {
      // Google's autocomplete owns arrow/enter handling in this mode.
      if (e.key === "Escape") {
        setIsSuggestionsOpen(false);
        setActiveIndex(-1);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isSuggestionsOpen) {
        setIsSuggestionsOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (isSuggestionsOpen && suggestions.length > 0) {
        e.preventDefault();
        const chosen = suggestions[activeIndex >= 0 ? activeIndex : 0];
        if (chosen) commitCity(chosen);
      }
    } else if (e.key === "Escape") {
      setIsSuggestionsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Tab") {
      setIsSuggestionsOpen(false);
    }
  };

  const showClear = Boolean(query);

  return (
    <div ref={wrapRef} className="relative">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold text-[#062B3A] uppercase tracking-[0.1em] mb-1.5"
      >
        {label}
      </label>

      <div className="relative">
        <MapPin
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
            value ? "text-[#FF6B1A]" : "text-slate-400"
          )}
        />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role={placesMode ? undefined : "combobox"}
          aria-expanded={placesMode ? undefined : isSuggestionsOpen}
          aria-autocomplete={placesMode ? undefined : "list"}
          aria-controls={placesMode ? undefined : listboxId}
          aria-activedescendant={!placesMode && activeIndex >= 0 && suggestions[activeIndex] ? optionId(activeIndex) : undefined}
          aria-invalid={hasError || undefined}
          autoComplete="off"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            setIsSuggestionsOpen(true);
            ensurePlacesLoaded();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full bg-white text-sm py-3 pl-10 pr-10 rounded-xl border text-[#062B3A]",
            "transition-all focus:outline-none focus:ring-2 focus:bg-white",
            hasError
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
              : "border-slate-200 focus:border-[#FF7A00] focus:ring-[#FF7A00]/20 hover:border-slate-300"
          )}
        />
        {showClear ? (
          <button
            type="button"
            onClick={clearSelection}
            aria-label="Clear location"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#FF6B1A] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : placesLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B1A] animate-spin pointer-events-none" />
        ) : (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
        )}
      </div>

      {/* Offline city-dataset dropdown (used until Google Places is ready). */}
      {!placesMode && isSuggestionsOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-[0_16px_40px_-12px_rgba(6,43,58,0.28)] overflow-hidden max-h-72 overflow-y-auto"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-300" />
              <span>
                {query.trim()
                  ? "No match — type a city, industrial hub, or state. Select from the list to continue."
                  : "Type a city, industrial hub, or state to begin."}
              </span>
            </li>
          ) : (
            suggestions.map((city, i) => {
              const isActive = i === activeIndex;
              return (
                <li key={city.id} role="option" aria-selected={isActive} id={optionId(i)}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => commitCity(city)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer",
                      isActive ? "bg-[#EDF4F8]" : "bg-white hover:bg-[#F6F9FB]"
                    )}
                  >
                    <MapPin
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0",
                        isActive ? "text-[#FF6B1A]" : "text-slate-300"
                      )}
                    />
                    <span className="min-w-0">
                      <span className={cn("block text-sm truncate", isActive ? "text-[#062B3A] font-black" : "text-[#062B3A] font-semibold")}>
                        {city.name}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {city.state}
                        {city.isHub ? " · Arrowline network hub" : ""}
                      </span>
                    </span>
                    {city.isHub && (
                      <ChevronDown className="ml-auto w-3.5 h-3.5 rotate-[-90deg] text-[#FF6B1A] flex-shrink-0" />
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}