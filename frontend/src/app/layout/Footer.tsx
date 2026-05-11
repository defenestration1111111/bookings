export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 text-sm text-gray-600 dark:text-gray-400 w-full py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span>© 2026 SkyGlide Inc. All rights reserved.</span>

          <div className="hidden md:block w-1 h-1 rounded-full bg-gray-400" />

          <div className="flex items-center gap-4">
            <a className="hover:underline transition-all" href="#">
              Privacy
            </a>

            <div className="w-1 h-1 rounded-full bg-gray-400" />

            <a className="hover:underline transition-all" href="#">
              Terms
            </a>

            <div className="w-1 h-1 rounded-full bg-gray-400" />

            <a className="hover:underline transition-all" href="#">
              Sitemap
            </a>

            <div className="w-1 h-1 rounded-full bg-gray-400" />

            <a className="hover:underline transition-all" href="#">
              Company details
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            type="button"
            className="flex items-center gap-2 hover:underline transition-all"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              language
            </span>
            <span>English (US)</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 hover:underline transition-all"
          >
            <span>$</span>
            <span>USD</span>
          </button>
        </div>
      </div>
    </footer>
  );
}