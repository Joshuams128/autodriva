export const metadata = {
  title: 'Book a Service — AutoDriva',
  description: 'Book your AutoDriva service appointment online.',
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-center mb-8">
          Book a Service
        </h1>
        <div className="bg-white rounded-xl overflow-hidden">
          <iframe
            src="https://book.squareup.com/appointments/325xcdqpna1ef5/location/L3JJQK4G945KD/services"
            title="Book a service with AutoDriva"
            className="w-full"
            style={{ minHeight: 800, border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
