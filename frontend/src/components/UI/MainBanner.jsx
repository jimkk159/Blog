import PinkButton from "./PinkButton";

function MainBanner() {
  return (
    <div
      className="flex h-[480px] w-full items-center justify-center rounded-3xl bg-cover p-16"
      style={{
        backgroundImage:
          "url(https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/pillars_of_creation.jpg)",
      }}
    >
      <div className="flex w-full flex-col items-center justify-center space-y-6">
        <p className="text-center text-lg text-white capitalize">Welcome To My Blog</p>
        <h1 className="text-center text-4xl font-bold uppercase text-white">
          <span className="text-self-pink-500">{"FIND "}</span>
          {"THE POST YOU LIKE"}
        </h1>
        <PinkButton text={"Browse Now"} />
      </div>
    </div>
  );
}

export default MainBanner;
