// icon
import { GiWhiteBook } from "react-icons/gi";
import { HiCursorClick } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";

// components
import PinkButton from "../UI/PinkButton";
import SectionTitle from "./SectionTitle";
import HowToItem from "../UI/Items/HotToItem";

function HowToSection() {
  const items = [
    {
      icon: (
        <HiCursorClick className="h-8 w-8 rounded-full bg-white text-self-pink-500" />
      ),
      title: "Click the 「Login」 Button On the Top",
      content:
        "Click the 「Login」 button on the top. You must create an account first. You can create an account by email and password style or just use google login.",
    },
    {
      icon: <BsPencilSquare className="h-8 w-8 bg-white text-self-pink-500" />,
      title: "Click The 「Write」 Button On The Top",
      content:
        "Click the 「Write」 button on the top. Now that you have your account, click the Write button on The navigation bar will take you to the create post page",
    },
    {
      icon: <GiWhiteBook className="h-8 w-8 bg-white text-self-pink-500" />,
      title: "Write Down Your Story",
      content: "Now just write down your story and share it with each other.",
    },
  ];

  return (
    <>
      <div className="flex w-full items-center justify-between whitespace-nowrap pb-10">
        <SectionTitle first={"How To Write"} second={"Your Story"} />
      </div>
      <ul className="space-y-8 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:space-y-0">
        {items.map((item, index) => (
          <HowToItem key={index} {...item} />
        ))}
      </ul>
      <div className="pt-16">
        <PinkButton text={"Sing Up Now"} />
      </div>
    </>
  );
}
export default HowToSection;
