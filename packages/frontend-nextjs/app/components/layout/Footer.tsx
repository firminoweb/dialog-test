// app/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-lg font-bold text-blue-600">
              Social Feed
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Conectando pessoas através de histórias
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div>
              <h3 className="font-medium mb-2">Links rápidos</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/profile?id=me" className="hover:text-blue-600 transition">
                    Perfil
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Sobre</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link href="#" className="hover:text-blue-600 transition">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-600 transition">
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Social Feed App - Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
