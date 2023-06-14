function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="h-full w-full bg-self-dark p-3">
      <p className={" min-h-4 m-2 text-center font-poppins text-sm text-white"}>
        Copyright © {year} Jim's Blog.
      </p>
      <p className={" min-h-4 m-2 text-center font-poppins text-sm text-white"}>
        All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
