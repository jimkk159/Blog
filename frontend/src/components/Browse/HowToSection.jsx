// icon
import { GiWhiteBook } from "react-icons/gi";
import { HiCursorClick } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";

// components
import PinkButton from "../UI/PinkButton";
import SectionTitle from "./SectionTitle";

function HowToSection() {
  return (
    <>
      <div className="flex w-full items-center justify-between whitespace-nowrap pb-10">
        <SectionTitle first={"How To Write"} second={"Your Story"} />
      </div>
      <ul className="space-y-8">
        <li className="rounded-3xl border border-self-gray p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <HiCursorClick className="h-8 w-8 rounded-full bg-white text-self-pink-500" />
          </div>
          <div>
            <h1 className="mt-5 text-xl font-bold capitalize text-white">
              Click the 「Login」 Button On the Top
            </h1>
          </div>
          <div>
            <p className="mt-3 text-[14px] leading-loose">
              Click the 「Login」 button on the top. You must create an account
              first. You can create an account by email and password style or
              just use google login.
            </p>
          </div>
        </li>
        <li className="rounded-3xl border border-self-gray p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <BsPencilSquare className="h-8 w-8 bg-white text-self-pink-500" />
          </div>
          <div>
            <h1 className="mt-5 text-xl font-bold capitalize text-white">
              Click The 「Write」 Button On The Top
            </h1>
          </div>
          <div>
            <p className="mt-3 text-[14px] leading-loose">
              Click the 「Write」 button on the top. Now that you have your
              account, click the Write button on The navigation bar will take
              you to the create post page
            </p>
          </div>
        </li>
        <li className="rounded-3xl border border-self-gray p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <GiWhiteBook className="h-8 w-8 bg-white text-self-pink-500" />
          </div>
          <div>
            <h1 className="mt-5 text-xl font-bold capitalize text-white">
              Write Down Your Story
            </h1>
          </div>
          <div>
            <p className="mt-3 text-[14px] leading-loose">
              Now just write down your story and share it with each other.
            </p>
          </div>
        </li>
      </ul>
      <div className="pt-16">
        <PinkButton text={"Go To Profile"} />
      </div>
    </>
  );
}
export default HowToSection;
