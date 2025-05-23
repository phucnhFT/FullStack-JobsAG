import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* logo & thông tin */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">JobsAG</h2>
            <p className="text-sm text-gray-500">© 2025 Nguyễn Hoàng Phúc</p>
            <p className="text-sm text-gray-400">Tìm việc nhanh</p>
          </div>

          {/* chuyển trang */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 transition">
              Trang chủ
            </a>
            <a href="/jobs" className="hover:text-blue-600 transition">
              Công việc
            </a>
            <a href="/about" className="hover:text-blue-600 transition">
              Về chúng tôi
            </a>
            <a href="/contact" className="hover:text-blue-600 transition">
              Liên hệ
            </a>
          </div>

          {/* icon */}
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=100029510903633"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" />
              </svg>
            </a>
            <a
              href="https://github.com/phucnhFT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 .296c-6.63 0-12 5.372-12 12 0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577v-2.162c-3.338.727-4.042-1.416-4.042-1 .416-.546-1.384-1.333-1.752-1.333-1.752-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.107-.775.418-1.305.76-1.605-2.665-.303-5.466-1.336-5.466-5.932 0-1.31.47-2.38 1.236-3.22-.123-.303-.536-1.523.116-3.176 0 0 1.01-.323 3.3 1.23a11.49 11.49 0 013.003-.404c1.018.005 2.04.138 3.002.404 2.29-1.553 3.3-1.23 3.3-1.23.653 1.653.24 2.873.117 3.176.768.84 1.235 1.91 1.235 3.22 0 4.61-2.806 5.625-5.475 5.92.429.37.812 1.102.812 2.22v3.293c0 .319.22.694.825.576C20.565 22.092 24 17.593 24 12.296c0-6.628-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
