import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="font-bold no-underline">
      <figure className="flex items-center gap-2">
        <Image
          src={"/Qwebinar.png"}
          alt="Qwebinar Logo"
          width={24}
          height={24}
          className="rounded-lg shadow-md"
        />
        <figcaption className="text-xl text-black">Qwebinar</figcaption>
      </figure>
    </Link>
  );
}
