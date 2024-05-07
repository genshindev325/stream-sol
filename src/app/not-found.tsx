import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col flex-1">
      <div className="absolute-center">
        <div className="text-[32px]">404 Error</div>
        <p className="text-[24px]">Page Not Found</p>
      </div>
    </div>
  );
}
