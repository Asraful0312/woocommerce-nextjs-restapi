import Image from "next/image";
import Link from "next/link";

const Logo = ({ logo }: { logo?: string }) => {
  return (
    <>
      {logo ? (
        <Link className="shrink-0" href={`/`}>
          <Image
            width={150}
            height={50}
            className="shrink-0 object-contain h-[50px] max-w-[100px] md:max-w-[150px]"
            src={logo}
            alt="logo"
          />
        </Link>
      ) : (
        <Link className="text-xl font-bold" href="/">
          Logo
        </Link>
      )}
    </>
  );
};

export default Logo;
