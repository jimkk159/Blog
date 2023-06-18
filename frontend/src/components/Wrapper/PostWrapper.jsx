function PostWrapper({ bottom, children }) {
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] w-full justify-center px-2 pb-12 pt-32 md:px-8 md:pt-12">
      <div className="relative flex h-full w-full flex-col justify-center rounded bg-self-dark p-0 text-black md:max-w-3xl md:p-6 lg:max-w-4xl lg:py-16">
        <div className="flex w-full flex-col justify-center rounded">
          <div className="mx-auto w-full max-w-3xl">
            {children}
            {bottom && <div className="mt-8">{bottom}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostWrapper;
