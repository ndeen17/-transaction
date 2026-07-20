import { ArrowDownCircleIcon } from "./icons";

const AVATAR_IDS = [12, 32, 47];

export function TrustBar() {
  return (
    <div className="flex items-center justify-between border-t border-[#EEF1F5] px-2 py-6 sm:px-4">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {AVATAR_IDS.map((id) => (
            <img
              key={id}
              src={`https://i.pravatar.cc/64?img=${id}`}
              alt=""
              className="h-9 w-9 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <p className="text-sm leading-tight text-ink">
          <span className="font-semibold">30k+ users</span>
          <br />
          <span className="text-muted">trust us</span>
        </p>
      </div>

      <a href="#about" className="flex items-center gap-2 text-sm text-ink">
        <span className="hidden sm:inline">Scroll down</span>
        <ArrowDownCircleIcon className="h-7 w-7 text-ink" />
      </a>
    </div>
  );
}
