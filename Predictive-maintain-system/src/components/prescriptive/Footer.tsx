// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="flex justify-between items-center p-4 bg-gray-100 mt-8">
      <div className="text-sm space-x-4">
        <a href="#" className="text-gray-700 hover:text-black">
          Privacy Policy
        </a>
        <a href="#" className="text-gray-700 hover:text-black">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
