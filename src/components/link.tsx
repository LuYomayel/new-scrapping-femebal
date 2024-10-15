import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/">Goleadores</Link>
      <Link href="/fairplay">Fair Play</Link>
      <Link href="/estadisticas">Estadísticas</Link>
    </nav>
  );
}