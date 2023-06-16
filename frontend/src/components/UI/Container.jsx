function Container({ left, right, children }) {
  return (
    <main className="flex w-full">
      <div className="h-full w-full px-6 py-12">
        <div className="flex min-h-screen w-full">
          <div className="flex-grow bg-purple-500 bg-opacity-20">{left}</div>
          <div className="w-full flex-grow h-full max-w-5xl pt-20 md:pt-0">{children}</div>
          <div className="flex-grow bg-green-500 bg-opacity-20">{right}</div>
        </div>
      </div>
    </main>
  );
}

export default Container;
