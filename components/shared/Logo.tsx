import Image from "next/image";
import Link from "next/link";

const Logo = ({ logo }: { logo?: string }) => {
  return (
    <>
      {logo ? (
        <Link href={`/`}>
          <Image
            width={40}
            height={40}
            className=""
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
