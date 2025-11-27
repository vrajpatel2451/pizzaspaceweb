import Link from "next/link";

export function FooterCopyright() {
  return (
    <div className="border-t border-gray-700 mt-8 pt-6">
      <p className="text-center text-gray-400 text-sm">
        © 2025 Pizza Space. All rights reserved. Powered by{" "}
        <Link href="/" className="text-orange-500 hover:text-orange-400 transition-colors">
          Pizza Space
        </Link>
      </p>
    </div>
  );
}
