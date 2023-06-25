function HowToItem({ icon, title, content }) {
  return (
    <li className="rounded-3xl border border-self-gray p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
        {icon}
      </div>
      <div>
        <h1 className="mt-5 text-xl font-bold capitalize text-white lg:h-16">
          {title}
        </h1>
      </div>
      <div>
        <p className="mt-3 text-[14px] leading-loose">{content}</p>
      </div>
    </li>
  );
}

export default HowToItem;
