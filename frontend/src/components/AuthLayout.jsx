export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-hard p-8 md:p-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-bounce-soft">🏠</div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {title}
          </h1>
          <p className="text-gray-500 text-sm">RentalHouse - Find Your Perfect Home</p>
        </div>
        {children}
      </div>
    </div>
  );
}
