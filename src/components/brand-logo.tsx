import Image from 'next/image';
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return <span className="brand-logo"><Image className="logo-dark" src="/images/storex-logo-white.svg" width={450} height={66} alt="STOREX" priority={priority}/><Image className="logo-light" src="/images/storex-logo-blue.svg" width={450} height={66} alt="STOREX" priority={priority}/></span>;
}
