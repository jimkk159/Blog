import { useState } from "react";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

// components
import RankItem2 from "../Items/Rank2";
import SectionTitle from "./SectionTitle";

function RankingList2({ posts }) {
  const [show, setShow] = useState(true);

  return (
    <div className="flex h-fit w-20 min-w-[100px] max-w-xs flex-col rounded-3xl bg-self-dark p-8 pb-2 lg:w-fit lg:p-6">
      <div className="flex items-center justify-start">
        <SectionTitle first={"Top"} second={"Posts"} />
      </div>
      {!show && (
        <div className="flex items-center justify-center border-t border-self-gray pt-2 mt-4">
          <AiFillCaretDown className="h-8 w-8" onClick={() => setShow(true)} />
        </div>
      )}
      {show && (
        <>
          <ul className="mt-8 space-y-6">
            {posts.slice(0, 5).map((post, index) => (
              <RankItem2 key={index} post={post} />
            ))}
          </ul>
          <div className="flex items-center justify-center border-t border-self-gray py-2 mt-4">
            <AiFillCaretUp className="h-8 w-8" onClick={() => setShow(false)} />
          </div>
        </>
      )}
    </div>
  );
}

export default RankingList2;
