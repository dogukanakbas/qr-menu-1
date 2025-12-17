export default function Home() {
  // Ana sayfa için static HTML'i göster
  return (
    <div>
      <iframe 
        src="/site/index.html" 
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="Ana Sayfa"
      />
    </div>
  );
}
