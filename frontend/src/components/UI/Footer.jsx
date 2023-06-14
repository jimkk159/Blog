function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex h-full w-full grid-flow-row grid-cols-2 justify-center bg-self-dark p-6">
      <div className="grid grid-cols-2 gap-x-4">
        <p
          className={
            "min-h-4 col-span-2 w-full text-center font-poppins text-sm text-white md:col-span-1"
          }
        >
          Copyright © {year} Jim's Blog.
        </p>
        <p
          className={
            "min-h-4 col-span-2 w-full text-center font-poppins text-sm text-white md:col-span-1 md:w-fit"
          }
        >
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
