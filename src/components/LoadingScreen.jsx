export function LoadingScreen({ message = 'Chargement...' }) {
  return (
    <main className="center-screen">
      <div className="loader" aria-hidden="true" />
      <p>{message}</p>
    </main>
  );
}
